import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../hooks/useSound';
import { useAppContext } from '../AppContext';
import { getComplianceFeedback } from '../utils/complianceMessages';
import { GameModeSelectModal } from '../components/game/GameModeSelectModal';

const tasksArray = [
  "Look at the furthest wall for 30 seconds.",
  "Drink a full glass of water.",
  "Text someone a photo from your camera roll from 2020.",
  "Open a window. Close it.",
  " STAND UP and touch your toes once.",
  "Name 3 things you can hear right now.",
  "Play one round of Zip (Train Mode)."
];

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const { playBloop } = useSound();
  const { incrementStreak, addFeetSavedExplicit, complianceReport, pendingFeetSeconds, lastSessionMode } = useAppContext();
  const [task, setTask] = useState('');
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  useEffect(() => {
    playBloop();
    setTask(tasksArray[Math.floor(Math.random() * tasksArray.length)]);
  }, [playBloop]);

  const feedback = complianceReport && lastSessionMode
    ? getComplianceFeedback(complianceReport, lastSessionMode, pendingFeetSeconds)
    : null;

  const handleReturn = () => {
    if (!feedback || feedback.streakImpact) {
      incrementStreak();
    }
    if (feedback) {
      addFeetSavedExplicit(feedback.feetSavedToAdd);
    }
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen w-full flex flex-col items-center justify-center bg-black px-6 void-gradient relative"
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg gap-6">

        {/* Compliance Feedback Card */}
        {feedback && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className={`w-full p-6 bg-surface-container-low/40 backdrop-blur-md border-l-4 ${feedback.colorStyle} rounded-r-2xl shadow-lg border-y border-r border-white/5`}
          >
             <p className="font-label text-xs tracking-widest uppercase text-on-surface opacity-80 mb-2">
               Compliance Analysis
             </p>
             <p className="font-body text-sm text-on-surface/90 leading-relaxed">
               {feedback.message}
             </p>
          </motion.div>
        )}

        {/* Micro-Task Card */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={`bg-surface-container-low/20 backdrop-blur-xl border border-white/5 p-12 rounded-[2rem] w-full shadow-2xl flex items-center justify-center ${feedback ? 'min-h-[200px]' : 'min-h-[300px]'}`}
        >
          <p className="font-headline text-2xl md:text-3xl text-on-surface text-center italic leading-relaxed">
            "{task}"
          </p>
        </motion.div>

        {/* Game Suggestion Card */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => setIsGameModalOpen(true)}
          className="w-full p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-4 hover:bg-primary/20 transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <div className="flex-1">
            <p className="font-headline text-sm text-white">Brain warm-up?</p>
            <p className="font-body text-[10px] text-primary/60 uppercase tracking-widest font-bold">Try a quick Zip puzzle</p>
          </div>
          <span className="material-symbols-outlined text-white/40">chevron_right</span>
        </motion.button>
      </div>

      <GameModeSelectModal 
        isOpen={isGameModalOpen} 
        onClose={() => setIsGameModalOpen(false)} 
      />

      <div className="w-full max-w-md pb-16">
        <button
          onClick={handleReturn}
          className="w-full py-5 bg-transparent border border-white/20 rounded-full text-on-surface font-label font-bold tracking-[0.15em] uppercase hover:bg-white/5 active:bg-white/10 transition-all duration-300"
        >
          Return to Void
        </button>
      </div>
    </motion.div>
  );
};
