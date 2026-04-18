import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTimer } from '../hooks/useTimer';
import { getDailyQuote } from '../data/triviaData';
import { VisualCrutch } from '../components/VisualCrutch';
import { useAppContext } from '../AppContext';
import { useComplianceTracker } from '../hooks/useComplianceTracker';

export const FocusSession: React.FC = () => {
  const navigate = useNavigate();
  const { seconds, formattedTime } = useTimer(true, 0, false);
  const [trivia, setTrivia] = useState('');
  const { setComplianceReport, setPendingFeetSeconds, setLastSessionMode } = useAppContext();
  
  const { startTracking, stopTracking, getComplianceReport, totalViolations } = useComplianceTracker('free', true);

  useEffect(() => {
    setTrivia(getDailyQuote());
    startTracking();
  }, [startTracking]);

  const handleEndSession = () => {
    stopTracking();
    const report = getComplianceReport(false); // Free mode has no predefined end, so never "early"
    setComplianceReport(report);
    setPendingFeetSeconds(seconds);
    setLastSessionMode('free');
    navigate('/dichotomy');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden void-gradient"
    >
      <VisualCrutch />
      
      {/* Compliance Indicator */}
      <div 
        className="absolute top-6 left-6 z-50 opacity-30 hover:opacity-100 transition-opacity cursor-default" 
        title="Gentle accountability: We're noticing if you stay focused. This helps you build awareness."
      >
        <span className="material-symbols-outlined text-white text-xl">visibility</span>
      </div>
      
      <div className="z-10 flex flex-col items-center justify-between h-full py-24 w-full px-8">
        
        {/* Top Third - Trivia */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 2 }}
          className="w-full max-w-md text-center"
        >
          <p className="font-headline text-on-surface opacity-80 text-xl md:text-2xl italic leading-relaxed">
            "{trivia}"
          </p>
        </motion.div>

        {/* Center - Timer */}
        <div className="flex flex-col items-center justify-center -mt-16">
          <span className="font-body text-7xl md:text-9xl text-primary font-bold tracking-tighter tabular-nums drop-shadow-2xl">
            {formattedTime}
          </span>
          <span className="font-label text-xs tracking-[0.3em] uppercase text-secondary opacity-40 mt-4">
            Session active
          </span>
          {totalViolations > 0 && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-label text-[10px] tracking-widest uppercase text-orange-400 mt-2"
            >
              Peeked {totalViolations} time{totalViolations !== 1 && 's'}
            </motion.span>
          )}
        </div>

        {/* Bottom - End Action */}
        <div className="w-full flex justify-end max-w-2xl px-4">
          <button
            onClick={handleEndSession}
            className="group flex items-center gap-2 hover:opacity-100 opacity-50 transition-opacity duration-300"
          >
            <span className="font-label text-xs tracking-widest uppercase text-white">End Session</span>
            <span className="material-symbols-outlined text-white text-sm group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
