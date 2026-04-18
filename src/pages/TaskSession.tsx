import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTimer } from '../hooks/useTimer';
import { getDailyQuote } from '../data/triviaData';
import { VisualCrutch } from '../components/VisualCrutch';
import { useAppContext } from '../AppContext';
import { useSound } from '../hooks/useSound';
import { useComplianceTracker } from '../hooks/useComplianceTracker';

export const TaskSession: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const durationMinutes = location.state?.duration || 10;
  
  const initialSeconds = durationMinutes * 60;
  const { seconds, formattedTime } = useTimer(true, initialSeconds, true);
  
  const [trivia, setTrivia] = useState('');
  const { setComplianceReport, setPendingFeetSeconds, setLastSessionMode } = useAppContext();
  const { playChime } = useSound();
  const [hasPlayedChime, setHasPlayedChime] = useState(false);

  const { startTracking, stopTracking, getComplianceReport, totalViolations } = useComplianceTracker('task', true);

  useEffect(() => {
    setTrivia(getDailyQuote());
    startTracking();
  }, [startTracking]);

  useEffect(() => {
    if (seconds <= 0 && !hasPlayedChime) {
      playChime();
      setHasPlayedChime(true);
    }
  }, [seconds, hasPlayedChime, playChime]);

  const handleEndSession = () => {
    stopTracking();
    const completedSeconds = initialSeconds - seconds;
    const isEarly = seconds > 0;
    const report = getComplianceReport(isEarly);
    
    setComplianceReport(report);
    setPendingFeetSeconds(completedSeconds);
    setLastSessionMode('task');
    navigate('/dichotomy');
  };

  const progressPercentage = ((initialSeconds - seconds) / initialSeconds) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden void-gradient"
    >
      <VisualCrutch />
      
      {/* Progress Bar Top Edge */}
      <div className="absolute top-0 left-0 h-1 bg-white/20 w-full z-50">
        <motion.div 
          className="h-full bg-primary"
          style={{ width: `${progressPercentage}%` }}
          layout
        />
      </div>

      {/* Compliance Indicator */}
      <div 
        className="absolute top-6 left-6 z-50 opacity-30 hover:opacity-100 transition-opacity cursor-default mt-2" 
        title="Gentle accountability: We're noticing if you switch contexts."
      >
        <span className="material-symbols-outlined text-white text-xl">shield</span>
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
          <span className={`font-body text-7xl md:text-9xl ${seconds === 0 ? 'text-green-400' : 'text-primary'} font-bold tracking-tighter tabular-nums drop-shadow-2xl transition-colors duration-1000`}>
            {formattedTime}
          </span>
          <span className="font-label text-xs tracking-[0.3em] uppercase text-secondary opacity-40 mt-4">
            {seconds === 0 ? 'Constraint Fulfilled' : 'Constraint Active'}
          </span>
          {totalViolations > 0 && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-label text-[10px] tracking-widest uppercase text-orange-400 mt-2"
            >
              Focus Interrupted {totalViolations} time{totalViolations !== 1 && 's'}
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
