import { useState, useEffect, useRef } from 'react';
import type { MonitoredApp } from '../context/LimitsContext';

const isNative = (): boolean => {
  try {
    return !!(window as unknown as { Capacitor?: { isNativePlatform: () => boolean } })
      .Capacitor?.isNativePlatform();
  } catch {
    return false;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadUsageStats = (): Promise<any> => {
  const pkg = '@capgo/capacitor-android-usagestatsmanager';
  return import(/* @vite-ignore */ pkg)
    .then(m => m.UsageStats)
    .catch(() => null);
};

interface InterceptResult {
  interceptedApp: MonitoredApp | null;
  dismissIntercept: () => void;
}

export const useInterceptOnResume = (monitoredApps: MonitoredApp[]): InterceptResult => {
  const [interceptedApp, setInterceptedApp] = useState<MonitoredApp | null>(null);
  const listenerRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (!isNative()) return;

    const setup = async () => {
      try {
        const { App } = await import('@capacitor/app');
        const UsageStats = await loadUsageStats();
        if (!UsageStats) return;

        const handle = await App.addListener('appStateChange', async ({ isActive }: { isActive: boolean }) => {
          if (!isActive) return;
          try {
            const recent = await UsageStats.queryAndAggregateUsageStats({
              startTime: Date.now() - 10000,
              endTime: Date.now(),
            }) as Record<string, { totalTimeInForeground: number }>;

            let mostRecentPackage = '';
            let maxTime = 0;
            for (const [pkg, stats] of Object.entries(recent)) {
              if (stats.totalTimeInForeground > maxTime) {
                maxTime = stats.totalTimeInForeground;
                mostRecentPackage = pkg;
              }
            }
            if (!mostRecentPackage) return;

            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const full = await UsageStats.queryAndAggregateUsageStats({
              startTime: startOfDay.getTime(),
              endTime: Date.now(),
            }) as Record<string, { totalTimeInForeground: number }>;

            const exceeded = monitoredApps.find(app => {
              if (!app.isMonitored || app.packageName !== mostRecentPackage) return false;
              const stats = full[app.packageName];
              return stats ? Math.round(stats.totalTimeInForeground / 60000) >= app.limitMinutes : false;
            });

            if (exceeded) setInterceptedApp(exceeded);
          } catch (err) {
            console.warn('Intercept check failed:', err);
          }
        });

        listenerRef.current = handle;
      } catch (e) {
        console.warn('App state listener unavailable:', e);
      }
    };

    setup();
    return () => { listenerRef.current?.remove(); };
  }, [monitoredApps]);

  return { interceptedApp, dismissIntercept: () => setInterceptedApp(null) };
};
