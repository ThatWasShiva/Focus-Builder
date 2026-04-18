/**
 * Type stubs for native Capacitor plugins that are not installed in the web build.
 * These are guarded by isNativePlatform() runtime checks and loaded via @vite-ignore
 * dynamic imports, so they only activate in the Android native build.
 */

declare module '@capgo/capacitor-android-usagestatsmanager' {
  export const UsageStats: {
    queryAndAggregateUsageStats(options: { startTime: number; endTime: number }): Promise<Record<string, { totalTimeInForeground: number }>>;
    checkPermission(): Promise<{ value: boolean }>;
    openUsageStatsSettings(): Promise<void>;
  };
}

declare module '@transistorsoft/capacitor-background-fetch' {
  export const BackgroundFetch: {
    configure(
      config: object,
      callback: (taskId: string) => void,
      timeout: (taskId: string) => void
    ): Promise<void>;
    start(): Promise<void>;
    finish(taskId: string): void;
  };
}
