import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLimits } from '../context/LimitsContext';
import { useAppUsageTracker } from '../hooks/useAppUsageTracker';

export const LimitsConfig: React.FC = () => {
  const navigate = useNavigate();
  const { monitoredApps, updateLimit, toggleMonitored, updateUsage, clearAllData } = useLimits();
  const { checkPermission, requestPermission, isNative, refreshAllUsage } = useAppUsageTracker();
  
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'unavailable' | 'loading'>('loading');
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkPermission().then(setPermissionStatus);
  }, [checkPermission]);

  const handleRefreshUsage = async () => {
    setRefreshing(true);
    const updatedUsage = await refreshAllUsage(monitoredApps);
    for (const [id, minutes] of Object.entries(updatedUsage)) {
      updateUsage(id, minutes);
    }
    setRefreshing(false);
  };

  const handleSave = () => {
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-black void-gradient flex flex-col overflow-y-auto no-scrollbar"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined text-white text-xl">arrow_back</span>
        </button>
        <h1 className="font-headline text-sm tracking-[0.3em] uppercase text-on-surface">App Limits</h1>
        <button
          onClick={handleRefreshUsage}
          className="opacity-40 hover:opacity-100 transition-opacity"
          disabled={refreshing}
        >
          <span className={`material-symbols-outlined text-white text-xl ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
        </button>
      </header>

      <div className="flex-1 max-w-lg mx-auto w-full px-6 py-8 flex flex-col gap-8">

        {/* Info Banner */}
        <div className="rounded-2xl bg-white/3 border border-white/5 px-5 py-4">
          <p className="font-body text-sm text-secondary opacity-70 leading-relaxed">
            Set daily time limits for apps you want to manage. When a limit is reached, Cognitive Gym will remind you and offer a focus session.
          </p>
          {!isNative && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-sm">📱</span>
              <p className="font-label text-xs text-blue-300 tracking-wide">
                Full tracking available on Android. Showing demo data.
              </p>
            </div>
          )}
        </div>

        {/* Android Permission Prompt */}
        {isNative && permissionStatus === 'denied' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-orange-500/10 border border-orange-500/30 px-5 py-4 flex flex-col gap-3"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="font-label text-xs tracking-widest uppercase text-orange-300 mb-1">Permission Required</p>
                <p className="font-body text-sm text-secondary opacity-80">
                  Cognitive Gym needs usage access to monitor app time. This data stays on your device.
                </p>
              </div>
            </div>
            <button
              onClick={requestPermission}
              className="w-full py-3 bg-orange-500/20 border border-orange-500/40 text-orange-300 font-label text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-orange-500/30 transition-colors"
            >
              Open Settings
            </button>
          </motion.div>
        )}

        {/* App List */}
        <div className="flex flex-col gap-3">
          <h2 className="font-headline text-xs tracking-[0.3em] uppercase text-secondary opacity-40">Your Apps</h2>
          {monitoredApps.map((app) => {
            const exceeded = app.isMonitored && app.todayUsageMinutes >= app.limitMinutes;
            const usagePercent = app.limitMinutes > 0
              ? Math.min((app.todayUsageMinutes / app.limitMinutes) * 100, 100)
              : 0;

            return (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-5 flex flex-col gap-4 transition-colors duration-300 ${
                  exceeded
                    ? 'bg-red-500/5 border-red-500/20'
                    : app.isMonitored
                    ? 'bg-white/3 border-white/10'
                    : 'bg-transparent border-white/5'
                }`}
              >
                {/* Top Row: Icon + Name + Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl bg-white/5">
                    {app.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-sm text-on-surface">{app.appName}</p>
                    {app.isMonitored && (
                      <p className={`font-label text-xs mt-0.5 ${exceeded ? 'text-red-400' : 'text-secondary opacity-50'}`}>
                        {exceeded ? '⚠️ Limit exceeded' : `Today: ${app.todayUsageMinutes} min`}
                      </p>
                    )}
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleMonitored(app.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
                      app.isMonitored ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <motion.div
                      layout
                      className={`absolute top-1 w-4 h-4 rounded-full ${
                        app.isMonitored ? 'bg-black' : 'bg-white/40'
                      }`}
                      animate={{ left: app.isMonitored ? '26px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Expandable limit config */}
                <AnimatePresence>
                  {app.isMonitored && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 pt-1 border-t border-white/5">
                        {/* Slider */}
                        <div className="flex items-center justify-between">
                          <p className="font-label text-xs tracking-widest uppercase opacity-40">Daily Limit</p>
                          <p className="font-body text-sm font-semibold text-on-surface">
                            {app.limitMinutes} min
                          </p>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={240}
                          step={5}
                          value={app.limitMinutes}
                          onChange={(e) => updateLimit(app.id, parseInt(e.target.value))}
                          className="w-full h-1 accent-white rounded-full bg-white/10 outline-none"
                        />
                        <div className="flex justify-between">
                          <span className="font-label text-xs opacity-20">5 min</span>
                          <span className="font-label text-xs opacity-20">4 hr</span>
                        </div>

                        {/* Usage progress bar */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-label text-xs opacity-30 uppercase tracking-widest">Progress</span>
                            <span className="font-label text-xs opacity-50">{Math.round(usagePercent)}%</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${exceeded ? 'bg-red-500' : usagePercent > 75 ? 'bg-orange-400' : 'bg-primary'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${usagePercent}%` }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3 pb-10">
          <button
            onClick={handleSave}
            className="w-full py-5 bg-white rounded-full text-black font-label font-bold tracking-[0.15em] uppercase hover:bg-white/90 active:scale-95 transition-all duration-200 shadow-2xl shadow-white/5"
          >
            {saveFeedback ? '✓ Saved' : 'Save Changes'}
          </button>
          <button
            onClick={clearAllData}
            className="w-full py-3 bg-transparent border border-red-500/20 text-red-400/60 font-label text-xs tracking-[0.15em] uppercase rounded-full hover:bg-red-500/5 hover:border-red-500/30 transition-all duration-200"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </motion.div>
  );
};
