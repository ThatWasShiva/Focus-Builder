import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLimits } from '../context/LimitsContext';

export const UsageSummaryWidget: React.FC = () => {
  const navigate = useNavigate();
  const { monitoredApps, totalUsageToday, totalLimitToday } = useLimits();

  const activeApps = monitoredApps.filter(a => a.isMonitored);
  const exceededCount = activeApps.filter(a => a.todayUsageMinutes >= a.limitMinutes).length;
  const percentage = totalLimitToday > 0 ? Math.min((totalUsageToday / totalLimitToday) * 100, 100) : 0;

  const barColor = percentage >= 100
    ? 'bg-red-500'
    : percentage >= 75
    ? 'bg-orange-400'
    : 'bg-primary';

  if (activeApps.length === 0) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate('/limits')}
        className="w-full text-left px-5 py-4 bg-surface-container-low/30 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📱</span>
          <div>
            <p className="font-label text-xs tracking-widest uppercase text-secondary opacity-60">App Limits</p>
            <p className="font-body text-sm text-on-surface opacity-60 mt-0.5">Tap to set daily app limits</p>
          </div>
          <span className="material-symbols-outlined text-white opacity-20 ml-auto text-base">chevron_right</span>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate('/limits')}
      className="w-full text-left px-5 py-4 bg-surface-container-low/30 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-xl">📱</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <p className="font-label text-xs tracking-widest uppercase text-secondary opacity-60">App Usage Today</p>
              {exceededCount > 0 && (
                <span className="font-label text-[10px] text-red-400 tracking-widest uppercase">
                  {exceededCount} limit{exceededCount > 1 ? 's' : ''} exceeded
                </span>
              )}
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${barColor}`}
              />
            </div>
            <p className="font-body text-xs text-secondary opacity-50 mt-1.5">
              {totalUsageToday} / {totalLimitToday} min across {activeApps.length} app{activeApps.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-white opacity-20 text-base mt-1">chevron_right</span>
      </div>
    </motion.button>
  );
};
