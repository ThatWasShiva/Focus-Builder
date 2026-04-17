import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const ModeSelection: React.FC = () => {
  const navigate = useNavigate();
  const [freeModeDuration, setFreeModeDuration] = useState(25);
  // Pre-roll a random task mode duration between 5 and 30
  const [taskModeDuration] = useState(() => Math.floor(Math.random() * 26) + 5);

  const startFreeMode = () => {
    navigate('/focus', { state: { duration: freeModeDuration } });
  };

  const startTaskMode = () => {
    navigate('/task-focus', { state: { duration: taskModeDuration } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-black void-gradient px-4 py-12 text-on-surface"
    >
      <header className="mb-12 text-center">
        <h1 className="font-headline text-3xl md:text-4xl italic text-on-surface tracking-widest mb-2">
          Select Your Path
        </h1>
        <p className="font-label text-xs tracking-[0.2em] uppercase text-secondary opacity-40">
          The void adapts to your intent.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Free Mode Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex-1 bg-surface-container-low border border-white/5 rounded-3xl p-8 flex flex-col justify-between group shadow-2xl transition-all"
        >
          <div>
            <h2 className="font-headline text-2xl mb-4">Free Mode</h2>
            <p className="font-body text-sm opacity-60 leading-relaxed mb-8">
              An open-ended session. The timer counts up. A single thought anchors you. You decide when it's over.
            </p>

            <div className="mb-8">
              <label className="flex justify-between font-label text-xs tracking-widest uppercase opacity-40 mb-3">
                <span>Target Duration</span>
                <span>{freeModeDuration} MIN</span>
              </label>
              <input
                type="range"
                min="1"
                max="120"
                value={freeModeDuration}
                onChange={(e) => setFreeModeDuration(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>
          
          <button
            onClick={startFreeMode}
            className="w-full py-4 bg-transparent border border-white/20 rounded-full text-on-surface font-label font-bold tracking-[0.1em] uppercase hover:bg-white/5 active:bg-white/10 transition-all duration-300 group-hover:border-white/40"
          >
            Initiate Free Flow
          </button>
        </motion.div>

        {/* Task Mode Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex-1 bg-surface-container-low border border-white/5 rounded-3xl p-8 flex flex-col justify-between group shadow-2xl transition-all"
        >
          <div>
            <h2 className="font-headline text-2xl mb-4">Task Mode</h2>
            <p className="font-body text-sm opacity-60 leading-relaxed mb-8">
              A structured commitment. You will be given a specific cognitive diversion. The timer counts down. You await the chime.
            </p>

            <div className="mb-8 flex flex-col items-center justify-center h-20 border border-white/5 rounded-xl bg-black/20">
               <span className="font-label text-xs tracking-widest uppercase opacity-40 mb-1">Assigned Duration</span>
               <span className="font-body text-3xl text-primary">{taskModeDuration} <span className="text-lg opacity-50">MIN</span></span>
            </div>
          </div>
          
          <button
            onClick={startTaskMode}
            className="w-full py-4 bg-transparent border border-white/20 rounded-full text-on-surface font-label font-bold tracking-[0.1em] uppercase hover:bg-white/5 active:bg-white/10 transition-all duration-300 group-hover:border-white/40"
          >
            Accept Constraint
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
