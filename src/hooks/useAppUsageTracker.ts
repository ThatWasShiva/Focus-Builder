import { useCallback } from 'react';
import type { MonitoredApp } from '../context/LimitsContext';

const isNative = (): boolean => {
  try {
    return !!(window as unknown as { Capacitor?: { isNativePlatform: () => boolean } })
      .Capacitor?.isNativePlatform();
  } catch {
    return false;
  }
};

const MOCK_USAGE: Record<string, number> = {
  'com.instagram.android': 45,
  'com.zhiliaoapp.musically': 67,
  'com.google.android.youtube': 38,
  'com.twitter.android': 22,
  'com.reddit.frontpage': 15,
  'com.snapchat.android': 8,
  'com.facebook.katana': 12,
  'com.whatsapp': 30,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadUsageStats = (): Promise<any> => {
  const pkg = '@capgo/capacitor-android-usagestatsmanager';
  return import(/* @vite-ignore */ pkg)
    .then(m => m.UsageStats)
    .catch(() => null);
};

export const useAppUsageTracker = () => {
  const getTodayUsage = useCallback(async (packageName: string): Promise<number> => {
    if (isNative()) {
      try {
        const UsageStats = await loadUsageStats();
        if (!UsageStats) return MOCK_USAGE[packageName] ?? 0;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const result = await UsageStats.queryAndAggregateUsageStats({
          startTime: startOfDay.getTime(),
          endTime: Date.now(),
        });
        const stats = (result as Record<string, { totalTimeInForeground: number }>)[packageName];
        return stats ? Math.round(stats.totalTimeInForeground / 60000) : 0;
      } catch {
        return MOCK_USAGE[packageName] ?? 0;
      }
    }
    return MOCK_USAGE[packageName] ?? 0;
  }, []);

  const refreshAllUsage = useCallback(async (apps: MonitoredApp[]): Promise<Record<string, number>> => {
    const results: Record<string, number> = {};
    await Promise.all(
      apps.filter(a => a.isMonitored).map(async (app) => {
        results[app.id] = await getTodayUsage(app.packageName);
      })
    );
    return results;
  }, [getTodayUsage]);

  const checkPermission = useCallback(async (): Promise<'granted' | 'denied' | 'unavailable'> => {
    if (!isNative()) return 'unavailable';
    try {
      const UsageStats = await loadUsageStats();
      if (!UsageStats) return 'unavailable';
      const res = await UsageStats.checkPermission();
      return res.value ? 'granted' : 'denied';
    } catch {
      return 'unavailable';
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isNative()) return;
    try {
      const UsageStats = await loadUsageStats();
      await UsageStats?.openUsageStatsSettings();
    } catch (e) {
      console.warn('Could not open usage stats settings:', e);
    }
  }, []);

  return { getTodayUsage, refreshAllUsage, checkPermission, requestPermission, isNative: isNative() };
};
