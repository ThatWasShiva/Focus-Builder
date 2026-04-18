export interface Node {
  x: number;
  y: number;
}

export interface GridNode extends Node {
  visited: boolean;
  isStart?: boolean;
}

/**
 * Creates a blank grid of the specified size.
 */
export const createEmptyGrid = (size: number): GridNode[][] => {
  const grid: GridNode[][] = [];
  for (let y = 0; y < size; y++) {
    const row: GridNode[] = [];
    for (let x = 0; x < size; x++) {
      row.push({ x, y, visited: false });
    }
    grid.push(row);
  }
  return grid;
};

/**
 * Generates a solvable Hamiltonian path-based puzzle.
 * Uses randomized DFS to find a path that visits every node once.
 */
export const generateSolvablePuzzle = (size: number): { grid: GridNode[][]; startNode: Node } => {
  const grid = createEmptyGrid(size);
  const path: Node[] = [];
  
  // Start from a random edge or corner to make it more interesting
  const startX = Math.floor(Math.random() * size);
  const startY = Math.floor(Math.random() * size);
  
  const solve = (x: number, y: number): boolean => {
    if (path.length === size * size) return true;
    
    // Shuffle neighbors for randomness
    const neighbors = [
      { x: x + 1, y }, { x: x - 1, y },
      { x, y: y + 1 }, { x, y: y - 1 }
    ].sort(() => Math.random() - 0.5);
    
    for (const next of neighbors) {
      if (
        next.x >= 0 && next.x < size &&
        next.y >= 0 && next.y < size &&
        !grid[next.y][next.x].visited
      ) {
        grid[next.y][next.x].visited = true;
        path.push(next);
        if (solve(next.x, next.y)) return true;
        path.pop();
        grid[next.y][next.x].visited = false;
      }
    }
    return false;
  };
  
  grid[startY][startX].visited = true;
  path.push({ x: startX, y: startY });
  
  // If we can't find a Hamiltonian path (rare for these sizes but possible), retry once or default
  if (!solve(startX, startY)) {
    // Basic fallback: just return the start node and hope for the best, or recursion
    return generateSolvablePuzzle(size);
  }
  
  // Reset visited status for the actual game play, except the start node
  const finalGrid = createEmptyGrid(size);
  finalGrid[startY][startX].isStart = true;
  
  return { grid: finalGrid, startNode: { x: startX, y: startY } };
};

export const canConnect = (
  from: Node,
  to: Node,
  currentPath: Node[]
): boolean => {
  // Check adjacency (Manhattan distance must be 1)
  const dx = Math.abs(from.x - to.x);
  const dy = Math.abs(from.y - to.y);
  if (dx + dy !== 1) return false;
  
  // Check if target node already in path
  const isAlreadyInPath = currentPath.some(n => n.x === to.x && n.y === to.y);
  return !isAlreadyInPath;
};

export const calculateScore = (size: number, seconds: number, hintsUsed: number): number => {
  const base = size * size * 20;
  const timePenalty = seconds * 2;
  const hintPenalty = hintsUsed * 50;
  return Math.max(10, base - timePenalty - hintPenalty);
};

export const saveToLeaderboard = (size: number, score: number, time: number) => {
  const key = 'zip_train_leaderboard';
  const raw = localStorage.getItem(key);
  const data = raw ? JSON.parse(raw) : {};
  
  if (!data[size] || data[size].score < score) {
    data[size] = { score, time, date: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(data));
  }
};
