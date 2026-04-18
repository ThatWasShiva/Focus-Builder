import React, { useRef, useEffect, useCallback } from 'react';
import type { Node } from '../../utils/gameUtils';

interface GameCanvasProps {
  gridSize: number;
  path: Node[];
  onPointerDown: (node: Node) => void;
  onPointerMove: (node: Node) => void;
  onPointerUp: () => void;
  isComplete: boolean;
  color: string;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gridSize,
  path,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  isComplete,
  color,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getGridPos = useCallback((e: React.PointerEvent | PointerEvent): Node | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const cellSize = rect.width / gridSize;
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      return { x: gridX, y: gridY };
    }
    return null;
  }, [gridSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const cellSize = size / gridSize;
      const padding = cellSize / 2;

      // Draw dots
      for (let gy = 0; gy < gridSize; gy++) {
        for (let gx = 0; gx < gridSize; gx++) {
          ctx.beginPath();
          ctx.arc(gx * cellSize + padding, gy * cellSize + padding, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fill();
        }
      }

      // Draw Path
      if (path.length > 0) {
        ctx.beginPath();
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        
        path.forEach((node, index) => {
          const px = node.x * cellSize + padding;
          const py = node.y * cellSize + padding;
          if (index === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        
        ctx.stroke();

        // Draw active nodes
        path.forEach((node, index) => {
          ctx.beginPath();
          ctx.arc(node.x * cellSize + padding, node.y * cellSize + padding, 8, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          
          if (index === 0) {
            ctx.beginPath();
            ctx.arc(node.x * cellSize + padding, node.y * cellSize + padding, 12, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      }
    };

    draw();
  }, [gridSize, path, color, isComplete]);

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[400px] touch-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onPointerDown={(e) => {
          const pos = getGridPos(e);
          if (pos) onPointerDown(pos);
        }}
        onPointerMove={(e) => {
          const pos = getGridPos(e);
          if (pos) onPointerMove(pos);
        }}
        onPointerUp={onPointerUp}
      />
    </div>
  );
};
