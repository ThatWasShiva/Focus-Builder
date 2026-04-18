import React, { useState } from 'react';

interface UnwindOverlayProps {
  onUndo: () => void;
  onAmbientToggle: (active: boolean) => void;
}

export const UnwindModeOverlay: React.FC<UnwindOverlayProps> = ({ onUndo, onAmbientToggle }) => {
  const [isAmbientActive, setIsAmbientActive] = useState(false);

  return (
    <div className="w-full flex justify-between items-center">
      <button 
        onClick={() => {
          const newState = !isAmbientActive;
          setIsAmbientActive(newState);
          onAmbientToggle(newState);
        }}
        className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-500 ${
          isAmbientActive 
            ? 'bg-secondary/20 border-secondary/40 text-secondary' 
            : 'bg-white/5 border-white/10 text-white/40'
        }`}
      >
        <span className="material-symbols-outlined text-lg">
          {isAmbientActive ? 'volume_up' : 'volume_off'}
        </span>
        <span className="font-label text-[10px] tracking-widest uppercase">
          {isAmbientActive ? 'AMBIENT ON' : 'AMBIENT OFF'}
        </span>
      </button>

      <button 
        onClick={onUndo}
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
      >
        <span className="material-symbols-outlined text-lg">undo</span>
        <span className="font-label text-[10px] tracking-widest uppercase">UNDO</span>
      </button>
    </div>
  );
};
