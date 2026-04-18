import { useEffect } from 'react';
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
const loadBackgroundFetch = (): Promise<any> => {
  const pkg = '@transistorsoft/capacitor-background-fetch';
  return import(/* @vite-ignore */ pkg)
    .then(m => m.BackgroundFetch)
    .catch(() => null);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadUsageStats = (): Promise<any> => {
  const pkg = '@capgo/capacitor-android-usagestatsmanager';
  return import(/* @vite-ignore */ pkg)
    .then(m => m.UsageStats)
    .catch(() => null);
};

interface BackgroundTimerOptions {
  monitoredApps: MonitoredApp[];
  onLimitExceeded: (app: MonitoredApp) => void;
  onUsageUpdated: (id: string, minutes: number) => void;
}

export const useBackgroundTimer = ({
  monitoredApps,
  onLimitExceeded,
  onUsageUpdated,
}: BackgroundTimerOptions) => {
  useEffect(() => {
    if (!isNative()) return;

    let mounted = true;

    const init = async () => {
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        const BackgroundFetch = await loadBackgroundFetch();
        if (!BackgroundFetch) return;

        await LocalNotifications.requestPermissions();

        await BackgroundFetch.configure({
          minimumFetchInterval: 15,
          stopOnTerminate: false,
          enableHeadless: true,
          requiresCharging: false,
          requiresDeviceIdle: false,
          requiresBatteryNotLow: false,
          requiresStorageNotLow: false,
          requiredNetworkType: 0,
        }, async (taskId: string) => {
          if (!mounted) { BackgroundFetch.finish(taskId); return; }

          try {
            const UsageStats = await loadUsageStats();
            if (!UsageStats) { BackgroundFetch.finish(taskId); return; }

            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const result = await UsageStats.queryAndAggregateUsageStats({
              startTime: startOfDay.getTime(),
              endTime: Date.now(),
            }) as Record<string, { totalTimeInForeground: number }>;

            const notifiedIds = new Set<string>();
            for (const app of monitoredApps.filter(a => a.isMonitored)) {
              const stats = result[app.packageName];
              const usageMin = stats ? Math.round(stats.totalTimeInForeground / 60000) : 0;
              onUsageUpdated(app.id, usageMin);

              if (usageMin >= app.limitMinutes && !notifiedIds.has(app.id)) {
                notifiedIds.add(app.id);
                onLimitExceeded(app);
                await LocalNotifications.schedule({
                  notifications: [{
                    title: '⏰ Limit Reached',
                    body: `You've reached your ${app.appName} limit for today. Take a break?`,
                    id: Math.abs(app.id.split('').reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0)) % 100000,
                    schedule: { at: new Date(Date.now() + 1000) },
                    extra: { navigateTo: '/mode' },
                  }],
                });
              }
            }
          } catch (err) {
            console.warn('Background fetch task failed:', err);
          }
          BackgroundFetch.finish(taskId);
        }, (taskId: string) => {
          BackgroundFetch.finish(taskId);
        });

        await BackgroundFetch.start();
      } catch (e) {
        console.warn('BackgroundFetch unavailable:', e);
      }
    };

    init();
    return () => { mounted = false; };
  }, []);
};
