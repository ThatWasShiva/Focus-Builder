import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CompletionModalProps {
  mode: 'train' | 'unwind';
  score: number;
  time: string;
  onNext: () => void;
  onRetry: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  mode,
  score,
  time,
  onNext,
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-surface-container-low border border-white/5 p-8 rounded-[2.5rem] shadow-2xl text-center"
      >
        <span className="material-symbols-outlined text-5xl text-primary mb-4 block">
          {mode === 'train' ? 'psychology' : 'spa'}
        </span>
        
        <h2 className="font-headline text-3xl text-white mb-2 italic">
          {mode === 'train' ? 'Sharp as ever.' : 'Mind at peace.'}
        </h2>
        
        <p className="font-body text-white/40 mb-8">
          {mode === 'train' 
            ? `You cleared the grid in ${time}! Your logic pathways are firing.` 
            : "You took your time and found the flow. That's what matters."}
        </p>

        {mode === 'train' && (
          <div className="bg-white/5 rounded-2xl p-4 mb-8 flex justify-between items-center px-8">
            <div className="text-left">
              <p className="font-label text-[10px] tracking-widest text-primary/60 uppercase">TIME</p>
              <p className="font-body text-lg text-white font-bold">{time}</p>
            </div>
            <div className="text-right">
              <p className="font-label text-[10px] tracking-widest text-primary/60 uppercase">SCORE</p>
              <p className="font-body text-lg text-white font-bold">{score}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button 
            onClick={onNext}
            className="w-full py-4 bg-white rounded-full text-black font-label font-bold tracking-widest uppercase text-xs"
          >
            {mode === 'train' ? 'NEXT LEVEL' : 'NEW PUZZLE'}
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 border border-white/10 rounded-full text-white/60 font-label font-bold tracking-widest uppercase text-xs hover:text-white hover:bg-white/5 transition-all"
          >
            BACK TO VOID
          </button>
        </div>
      </motion.div>
    </div>
  );
};
