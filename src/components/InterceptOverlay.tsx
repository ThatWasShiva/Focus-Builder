import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { MonitoredApp } from '../context/LimitsContext';

interface InterceptOverlayProps {
  app: MonitoredApp | null;
  onDismiss: () => void;
  onViolationLogged?: () => void;
}

export const InterceptOverlay: React.FC<InterceptOverlayProps> = ({ app, onDismiss, onViolationLogged }) => {
  const navigate = useNavigate();

  const handleStartSession = () => {
    onDismiss();
    navigate('/mode');
  };

  const handleIgnore = () => {
    onViolationLogged?.();
    onDismiss();
  };

  return (
    <AnimatePresence>
      {app && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6"
        >
          <motion.div
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-3xl">
              ⚠️
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="font-headline text-xl text-on-surface tracking-widest uppercase mb-3">
                Limit Reached
              </h2>
              <p className="font-body text-sm text-secondary leading-relaxed opacity-80">
                You've exceeded your{' '}
                <span className="text-on-surface font-semibold">{app.icon} {app.appName}</span>{' '}
                limit for today ({app.limitMinutes} min).
                Let's use this time intentionally.
              </p>
            </div>

            {/* Stats */}
            <div className="w-full flex justify-center gap-6 py-3 border-t border-b border-white/5">
              <div className="text-center">
                <p className="font-body text-2xl font-bold text-orange-400">{app.todayUsageMinutes}</p>
                <p className="font-label text-xs tracking-widest uppercase opacity-40 mt-1">Used</p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="font-body text-2xl font-bold text-primary">{app.limitMinutes}</p>
                <p className="font-label text-xs tracking-widest uppercase opacity-40 mt-1">Limit</p>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={handleStartSession}
                className="w-full py-4 bg-white text-black font-label font-bold tracking-[0.15em] uppercase rounded-full hover:bg-white/90 active:scale-95 transition-all duration-200"
              >
                Start a Session
              </button>
              <button
                onClick={handleIgnore}
                className="w-full py-3 bg-transparent border border-white/10 text-secondary font-label text-xs tracking-[0.15em] uppercase rounded-full hover:bg-white/5 active:bg-white/10 transition-all duration-200"
              >
                Ignore (log violation)
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
