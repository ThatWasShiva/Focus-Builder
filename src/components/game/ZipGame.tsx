import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GameCanvas } from './GameCanvas';
import { 
  generateSolvablePuzzle, 
  canConnect, 
  calculateScore, 
  saveToLeaderboard 
} from '../../utils/gameUtils';
import type { GridNode, Node } from '../../utils/gameUtils';
import { useGameTimer } from '../../hooks/useGameTimer';
import { useAmbientSound } from '../../hooks/useAmbientSound';
import { TrainModeOverlay } from './TrainModeOverlay';
import { UnwindModeOverlay } from './UnwindModeOverlay';
import { CompletionModal } from './CompletionModal';

export const ZipGame: React.FC = () => {
  const { mode } = useParams<{ mode: 'train' | 'unwind' }>();
  const navigate = useNavigate();
  const [gridSize, setGridSize] = useState(5);
  const [, setGrid] = useState<GridNode[][]>([]);
  const [path, setPath] = useState<Node[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);

  const timer = useGameTimer();
  const ambient = useAmbientSound();

  const initGame = useCallback(() => {
    const { grid: newGrid, startNode } = generateSolvablePuzzle(gridSize);
    setGrid(newGrid);
    setPath([startNode]);
    setIsComplete(false);
    setHintsUsed(0);
    setScore(0);
    timer.reset();
    if (mode === 'train') timer.start();
  }, [gridSize, mode, timer]);

  useEffect(() => {
    initGame();
  }, [gridSize]);

  useEffect(() => {
    return () => {
       timer.stop();
       ambient.stop();
    };
  }, [timer, ambient]);

  const handlePointerDown = (node: Node) => {
    const lastNode = path[path.length - 1];
    if (node.x === lastNode.x && node.y === lastNode.y) {
      setIsDrawing(true);
    } else if (path.length === 1 && node.x === path[0].x && node.y === path[0].y) {
      setIsDrawing(true);
    }
  };

  const handlePointerMove = (node: Node) => {
    if (!isDrawing || isComplete) return;
    
    const lastNode = path[path.length - 1];
    if (node.x === lastNode.x && node.y === lastNode.y) return;

    if (canConnect(lastNode, node, path)) {
      const newPath = [...path, node];
      setPath(newPath);
      
      if (newPath.length === gridSize * gridSize) {
        handleComplete();
      }
    } else {
      if (path.length > 1) {
        const prevNode = path[path.length - 2];
        if (node.x === prevNode.x && node.y === prevNode.y) {
          setPath(path.slice(0, -1));
        }
      }
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleComplete = () => {
    setIsComplete(true);
    setIsDrawing(false);
    timer.stop();
    
    if (mode === 'train') {
      const finalScore = calculateScore(gridSize, timer.seconds, hintsUsed);
      setScore(finalScore);
      saveToLeaderboard(gridSize, finalScore, timer.seconds);
    }
  };

  const handleHint = () => {
    if (isComplete) return;
    setHintsUsed(prev => prev + 1);
    
    const lastNode = path[path.length - 1];
    const neighbors = [
      { x: lastNode.x + 1, y: lastNode.y },
      { x: lastNode.x - 1, y: lastNode.y },
      { x: lastNode.x, y: lastNode.y + 1 },
      { x: lastNode.x, y: lastNode.y - 1 }
    ];
    
    const nextMove = neighbors.find(n => 
      n.x >= 0 && n.x < gridSize && 
      n.y >= 0 && n.y < gridSize && 
      !path.some(pn => pn.x === n.x && pn.y === n.y)
    );

    if (nextMove) {
      const nextPath = [...path, nextMove];
      setPath(nextPath);
      if (nextPath.length === gridSize * gridSize) {
        handleComplete();
      }
    }
  };

  const handleUndo = () => {
    if (path.length > 1) {
      setPath(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-black void-gradient overflow-hidden">
      <header className="p-6 flex justify-between items-center z-20">
        <button 
          onClick={() => navigate('/')}
          className="text-stone-400 hover:text-white flex items-center gap-2 font-label text-sm"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          DASHBOARD
        </button>
        <h1 className="font-headline tracking-widest text-white/40 uppercase text-xs">
          Zip · {mode === 'train' ? 'Train' : 'Unwind'}
        </h1>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="w-full max-w-sm flex justify-between items-end mb-4">
          {mode === 'train' ? (
            <TrainModeOverlay 
              time={timer.formattedTime} 
              score={score} 
              onHint={handleHint} 
            />
          ) : (
            <UnwindModeOverlay 
              onUndo={handleUndo} 
              onAmbientToggle={(play) => play ? ambient.play() : ambient.stop()} 
            />
          )}
        </div>

        <GameCanvas 
          gridSize={gridSize} 
          path={path} 
          onPointerDown={handlePointerDown} 
          onPointerMove={handlePointerMove} 
          onPointerUp={handlePointerUp}
          isComplete={isComplete}
          color={mode === 'train' ? '#00E5FF' : '#B388FF'}
        />

        <div className="flex gap-4 mt-8">
          <button 
            onClick={initGame}
            className="px-6 py-2 border border-white/10 rounded-full text-xs font-label tracking-widest text-white/60 hover:text-white hover:bg-white/5"
          >
            RESET
          </button>
          <button 
            onClick={() => {
              initGame();
            }}
            className="px-6 py-2 bg-white/10 rounded-full text-xs font-label tracking-widest text-white hover:bg-white/20"
          >
            NEW PUZZLE
          </button>
        </div>
      </main>

      <AnimatePresence>
        {isComplete && (
          <CompletionModal 
            mode={mode!} 
            score={score} 
            time={timer.formattedTime} 
            onNext={() => {
              if (gridSize < 8) setGridSize(s => s + 1);
              else initGame();
            }}
            onRetry={initGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
