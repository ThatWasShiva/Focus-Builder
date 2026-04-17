import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Dichotomy: React.FC = () => {
  const navigate = useNavigate();

  const handleSelection = () => {
    navigate('/result');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen w-full flex flex-col bg-black relative overflow-hidden"
    >
      <div className="absolute top-16 left-0 right-0 text-center z-10 px-4">
        <p className="font-headline text-on-surface opacity-80 text-xl italic drop-shadow-xl">
          "Choose one. It doesn't matter which."
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row w-full h-full">
        <div 
          onClick={handleSelection}
          className="flex-1 bg-[#1A3A5C] flex items-center justify-center cursor-pointer transition-colors hover:brightness-110 active:brightness-90 group"
        >
          <span className="font-label text-2xl tracking-[0.3em] font-bold text-white opacity-80 group-hover:opacity-100 transition-opacity">
            WATER
          </span>
        </div>
        <div 
          onClick={handleSelection}
          className="flex-1 bg-[#4A4A4A] flex items-center justify-center cursor-pointer transition-colors hover:brightness-110 active:brightness-90 group"
        >
          <span className="font-label text-2xl tracking-[0.3em] font-bold text-white opacity-80 group-hover:opacity-100 transition-opacity">
            STONE
          </span>
        </div>
      </div>
    </motion.div>
  );
};
