import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface MonitoredApp {
  id: string;
  packageName: string;
  appName: string;
  icon: string; // emoji icon for web preview
  limitMinutes: number;
  isMonitored: boolean;
  todayUsageMinutes: number;
}

interface LimitsContextType {
  monitoredApps: MonitoredApp[];
  addMonitoredApp: (app: MonitoredApp) => void;
  updateLimit: (id: string, limitMinutes: number) => void;
  toggleMonitored: (id: string) => void;
  updateUsage: (id: string, usageMinutes: number) => void;
  checkLimitExceeded: (id: string) => boolean;
  clearAllData: () => void;
  totalUsageToday: number;
  totalLimitToday: number;
}

const LimitsContext = createContext<LimitsContextType | undefined>(undefined);

const STORAGE_KEY = 'cg_monitored_apps';

// Default popular apps with mock usage data for web preview
const DEFAULT_APPS: MonitoredApp[] = [
  { id: 'instagram', packageName: 'com.instagram.android', appName: 'Instagram', icon: '📸', limitMinutes: 30, isMonitored: true, todayUsageMinutes: 45 },
  { id: 'tiktok', packageName: 'com.zhiliaoapp.musically', appName: 'TikTok', icon: '🎵', limitMinutes: 20, isMonitored: false, todayUsageMinutes: 67 },
  { id: 'youtube', packageName: 'com.google.android.youtube', appName: 'YouTube', icon: '▶️', limitMinutes: 60, isMonitored: true, todayUsageMinutes: 38 },
  { id: 'twitter', packageName: 'com.twitter.android', appName: 'X (Twitter)', icon: '𝕏', limitMinutes: 20, isMonitored: false, todayUsageMinutes: 22 },
  { id: 'reddit', packageName: 'com.reddit.frontpage', appName: 'Reddit', icon: '🔴', limitMinutes: 30, isMonitored: false, todayUsageMinutes: 15 },
  { id: 'snapchat', packageName: 'com.snapchat.android', appName: 'Snapchat', icon: '👻', limitMinutes: 15, isMonitored: false, todayUsageMinutes: 8 },
  { id: 'facebook', packageName: 'com.facebook.katana', appName: 'Facebook', icon: '📘', limitMinutes: 20, isMonitored: false, todayUsageMinutes: 12 },
  { id: 'whatsapp', packageName: 'com.whatsapp', appName: 'WhatsApp', icon: '💬', limitMinutes: 45, isMonitored: false, todayUsageMinutes: 30 },
];

const loadApps = (): MonitoredApp[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_APPS;
  } catch {
    return DEFAULT_APPS;
  }
};

export const LimitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [monitoredApps, setMonitoredApps] = useState<MonitoredApp[]>(loadApps);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(monitoredApps));
  }, [monitoredApps]);

  const addMonitoredApp = useCallback((app: MonitoredApp) => {
    setMonitoredApps(prev => {
      if (prev.find(a => a.id === app.id)) return prev;
      return [...prev, app];
    });
  }, []);

  const updateLimit = useCallback((id: string, limitMinutes: number) => {
    setMonitoredApps(prev =>
      prev.map(app => app.id === id ? { ...app, limitMinutes } : app)
    );
  }, []);

  const toggleMonitored = useCallback((id: string) => {
    setMonitoredApps(prev =>
      prev.map(app => app.id === id ? { ...app, isMonitored: !app.isMonitored } : app)
    );
  }, []);

  const updateUsage = useCallback((id: string, usageMinutes: number) => {
    setMonitoredApps(prev =>
      prev.map(app => app.id === id ? { ...app, todayUsageMinutes: usageMinutes } : app)
    );
  }, []);

  const checkLimitExceeded = useCallback((id: string): boolean => {
    const app = monitoredApps.find(a => a.id === id);
    if (!app || !app.isMonitored) return false;
    return app.todayUsageMinutes >= app.limitMinutes;
  }, [monitoredApps]);

  const clearAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setMonitoredApps(DEFAULT_APPS);
  }, []);

  const activeApps = monitoredApps.filter(a => a.isMonitored);
  const totalUsageToday = activeApps.reduce((sum, a) => sum + a.todayUsageMinutes, 0);
  const totalLimitToday = activeApps.reduce((sum, a) => sum + a.limitMinutes, 0);

  return (
    <LimitsContext.Provider value={{
      monitoredApps, addMonitoredApp, updateLimit, toggleMonitored,
      updateUsage, checkLimitExceeded, clearAllData,
      totalUsageToday, totalLimitToday,
    }}>
      {children}
    </LimitsContext.Provider>
  );
};

export const useLimits = () => {
  const ctx = useContext(LimitsContext);
  if (!ctx) throw new Error('useLimits must be used within LimitsProvider');
  return ctx;
};
