import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface GameModeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameModeSelectModal: React.FC<GameModeSelectModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const modes = [
    {
      id: 'train',
      title: 'Train',
      description: 'Sharpen your logic and focus with timed puzzles.',
      icon: 'psychology',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20'
    },
    {
      id: 'unwind',
      title: 'Unwind',
      description: 'Meditative, untimed puzzles for deep relaxation.',
      icon: 'spa',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      border: 'border-secondary/20'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="w-full max-w-sm bg-surface-container-low border border-white/5 rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h2 className="font-headline text-2xl text-white italic mb-2">Choose Your Flow</h2>
          <p className="font-body text-xs text-white/40 tracking-wider">ZIP PUZZLE LABS</p>
        </div>

        <div className="flex flex-col gap-4">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                navigate(`/game/${m.id}`);
                onClose();
              }}
              className={`group flex items-center gap-6 p-6 rounded-3xl border transition-all duration-300 text-left ${m.bg} ${m.border} hover:scale-[1.02] active:scale-95`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-black/20 ${m.color}`}>
                 <span className="material-symbols-outlined text-3xl font-light">{m.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline text-lg text-white mb-1">{m.title}</h3>
                <p className="font-body text-[11px] leading-relaxed text-white/50">{m.description}</p>
              </div>
              <span className={`material-symbols-outlined text-white/20 group-hover:text-white transition-colors`}>
                arrow_forward
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full py-4 font-label text-[10px] tracking-[0.2em] text-white/30 uppercase hover:text-white transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};
