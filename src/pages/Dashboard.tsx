import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { streakCount, totalFeetSaved } = useAppContext();

  // Create a fun milestone based calculation
  const getLandmark = (feet: number) => {
    if (feet < 14) return "a tall ladder";
    if (feet < 50) return "a small house";
    if (feet < 150) return "the Arc de Triomphe";
    if (feet < 305) return "the Statue of Liberty";
    if (feet < 1000) return "the Eiffel Tower";
    if (feet < 2716) return "the Burj Khalifa";
    return "Mount Everest";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen w-full flex flex-col items-center justify-between pt-24 pb-32 px-8 void-gradient overflow-y-auto no-scrollbar"
    >
      <header className="fixed top-0 w-full z-50 bg-black flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-stone-100">blur_on</span>
          <h1 className="text-lg font-headline tracking-[0.2em] text-stone-100 uppercase">THE VOID</h1>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8">
            <span className="text-stone-100 font-headline tracking-widest uppercase cursor-default">DASHBOARD</span>
          </nav>
        </div>
      </header>

      <section className="w-full max-w-lg flex flex-col items-start gap-4 mt-8">
        <div className="relative">
          <h2 className="font-headline text-3xl md:text-4xl text-on-surface leading-tight max-w-xs">
            Today you scrolled <span className="font-body font-bold text-primary italic">{Math.floor(totalFeetSaved)} fewer feet.</span>
          </h2>
          <div className="mt-4 flex items-center gap-3 opacity-60">
            <span className="material-symbols-outlined text-lg">architecture</span>
            <p className="font-label text-xs tracking-tight">Equivalent to the height of {getLandmark(totalFeetSaved)}.</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center relative mt-16 mb-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-[280px] h-[280px] rounded-full border border-white/5 scale-110"></div>
          <div className="absolute w-[240px] h-[240px] rounded-full border border-white/10 scale-105"></div>
          
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="orb-pulse w-56 h-56 rounded-full flex flex-col items-center justify-center bg-surface-container-low backdrop-blur-sm z-10 transition-transform hover:scale-105 duration-500 ease-out cursor-default"
          >
            <span className="font-body text-8xl font-bold text-primary tracking-tighter">{streakCount}</span>
            <span className="font-headline italic text-xs text-secondary opacity-80 tracking-[0.3em] uppercase mt-2">Days Streak</span>
          </motion.div>
        </div>
        <div className="mt-12 text-center max-w-xs px-4">
          <p className="font-headline text-secondary opacity-60 text-sm italic leading-relaxed">
            "The silence of the void is not empty; it is full of the things we chose not to see."
          </p>
        </div>
      </section>

      <section className="w-full max-w-md px-6">
        <button
          onClick={() => navigate('/calibrate')}
          className="w-full py-5 bg-white rounded-full text-on-primary-container font-label font-bold tracking-[0.15em] uppercase hover:bg-white/90 active:scale-95 transition-all duration-300 shadow-2xl shadow-white/5"
        >
          ENTER FOCUS
        </button>
      </section>
    </motion.div>
  );
};
