import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Calibration: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'IDLE' | 'PULSE' | 'WAIT_RESPONSE' | 'FEEDBACK'>('IDLE');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRitual = () => {
    setPhase('IDLE');
    setFeedbackMsg('');
    const delay = Math.floor(Math.random() * 4000) + 3000; // 3000 - 7000ms
    
    timeoutRef.current = setTimeout(() => {
      setPhase('PULSE');
      
      timeoutRef.current = setTimeout(() => {
        setPhase('WAIT_RESPONSE');
        
        timeoutRef.current = setTimeout(() => {
          handleMissed();
        }, 3000);
      }, 200);
    }, delay);
  };

  useEffect(() => {
    startRitual();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleTap = () => {
    if (phase === 'IDLE') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase('FEEDBACK');
      setFeedbackMsg('Impulsive. Focus.');
      setTimeout(startRitual, 2000);
    } else if (phase === 'PULSE' || phase === 'WAIT_RESPONSE') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      navigate('/focus');
    }
  };

  const handleMissed = () => {
    setPhase('FEEDBACK');
    setFeedbackMsg('Distracted. Again.');
    setTimeout(startRitual, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen w-full flex flex-col items-center justify-center bg-black cursor-pointer select-none"
      onClick={handleTap}
    >
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        {/* The Dot */}
        <motion.div
          animate={{
            scale: phase === 'PULSE' ? 1.5 : 1,
            opacity: phase === 'PULSE' ? 1 : 0.2
          }}
          transition={{ duration: 0.1 }}
          className="w-4 h-4 rounded-full bg-white mb-12"
        />
        
        <p className="absolute bottom-32 font-label text-secondary opacity-60 text-sm tracking-[0.2em] uppercase">
          Tap only when the dot pulses.
        </p>
        
        {phase === 'FEEDBACK' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-1/2 mt-12 font-headline text-error opacity-80 text-lg italic"
          >
             {feedbackMsg}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};
