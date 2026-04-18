import React from 'react';

interface TrainOverlayProps {
  time: string;
  score: number;
  onHint: () => void;
}

export const TrainModeOverlay: React.FC<TrainOverlayProps> = ({ time, score, onHint }) => (
  <div className="w-full flex justify-between items-end">
    <div className="flex flex-col gap-1">
      <span className="font-label text-[10px] tracking-widest text-primary/60 uppercase">TIME</span>
      <span className="font-body text-xl font-bold text-white tabular-nums">{time}</span>
    </div>
    <div className="flex flex-col items-center gap-2">
       <button 
        onClick={onHint}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
       >
         <span className="material-symbols-outlined text-xl text-primary">lightbulb</span>
       </button>
       <span className="font-label text-[8px] tracking-widest text-white/40 uppercase">HINT</span>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="font-label text-[10px] tracking-widest text-primary/60 uppercase">SCORE</span>
      <span className="font-body text-xl font-bold text-white tabular-nums">{score}</span>
    </div>
  </div>
);
