import React, { useState, useEffect } from 'react';
import Letter from './Letter';
import { LetterPosition } from '../utils/types';

interface BoardProps {
  grid: (string | null)[][];
  activeLetter: LetterPosition | null;
  wordSelection: { x: number, y: number }[];
  setWordSelection: React.Dispatch<React.SetStateAction<{ x: number, y: number }[]>>;
  tryWord: () => void;
  gameOver: boolean;
}

const Board: React.FC<BoardProps> = ({ 
  grid, 
  activeLetter, 
  wordSelection, 
  setWordSelection,
  tryWord,
  gameOver
}) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [touchMoveEnabled, setTouchMoveEnabled] = useState(false);
  
  // Helper to check if a cell is part of the current selection
  const isSelected = (x: number, y: number) => {
    return wordSelection.some(pos => pos.x === x && pos.y === y);
  };
  
  // Helper to check if a cell is adjacent to the last selected cell
  const isAdjacent = (x: number, y: number) => {
    if (wordSelection.length === 0) return true;
    
    const last = wordSelection[wordSelection.length - 1];
    const dx = Math.abs(last.x - x);
    const dy = Math.abs(last.y - y);
    
    // Adjacent horizontally, vertically, or diagonally
    return (dx <= 1 && dy <= 1) && !(dx === 0 && dy === 0);
  };
  
  // Handle mouse down to start selection
  const handleMouseDown = (x: number, y: number) => {
    if (gameOver || grid[y][x] === null) return;
    
    setSelectionMode(true);
    setWordSelection([{ x, y }]);
  };
  
  // Handle mouse enter during selection
  const handleMouseEnter = (x: number, y: number) => {
    if (!selectionMode || gameOver || grid[y][x] === null) return;
    
    if (isAdjacent(x, y) && !isSelected(x, y)) {
      setWordSelection(prev => [...prev, { x, y }]);
    }
  };
  
  // Handle mouse up to end selection
  const handleMouseUp = () => {
    if (selectionMode) {
      setSelectionMode(false);
      if (wordSelection.length >= 3) {
        tryWord();
      } else {
        setWordSelection([]);
      }
    }
  };
  
  // Handle touch events for mobile
  const handleTouchStart = (x: number, y: number) => {
    if (gameOver || grid[y][x] === null) return;
    
    setTouchMoveEnabled(true);
    setWordSelection([{ x, y }]);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchMoveEnabled || gameOver) return;
    
    const touch = e.touches[0];
    const board = e.currentTarget.getBoundingClientRect();
    const cellSize = board.width / grid[0].length;
    
    // Calculate touch position relative to board
    const touchX = Math.floor((touch.clientX - board.left) / cellSize);
    const touchY = Math.floor((touch.clientY - board.top) / cellSize);
    
    // Check if touch is within grid bounds
    if (touchX >= 0 && touchX < grid[0].length && touchY >= 0 && touchY < grid.length) {
      if (grid[touchY][touchX] !== null && isAdjacent(touchX, touchY) && !isSelected(touchX, touchY)) {
        setWordSelection(prev => [...prev, { x: touchX, y: touchY }]);
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (touchMoveEnabled) {
      setTouchMoveEnabled(false);
      if (wordSelection.length >= 3) {
        tryWord();
      } else {
        setWordSelection([]);
      }
    }
  };
  
  // Clean up event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (selectionMode) {
        setSelectionMode(false);
        if (wordSelection.length >= 3) {
          tryWord();
        } else {
          setWordSelection([]);
        }
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [selectionMode, wordSelection, tryWord, setWordSelection]);
  
  return (
    <div 
      className="relative bg-purple-800 bg-opacity-30 backdrop-blur-sm p-2 rounded-lg overflow-hidden"
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid gap-1" style={{ 
        gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`, 
        gridTemplateRows: `repeat(${grid.length}, 1fr)` 
      }}>
        {grid.map((row, y) => (
          row.map((cell, x) => {
            // Determine if this cell is the active falling letter
            const isActive = activeLetter?.x === x && activeLetter?.y === y;
            const selected = isSelected(x, y);
            
            return (
              <div 
                key={`${x}-${y}`} 
                className="w-full aspect-square"
                onMouseDown={() => handleMouseDown(x, y)}
                onMouseEnter={() => handleMouseEnter(x, y)}
                onTouchStart={() => handleTouchStart(x, y)}
              >
                {(cell !== null || isActive) && (
                  <Letter 
                    letter={isActive ? activeLetter!.letter : cell!} 
                    isActive={isActive}
                    isSelected={selected}
                    position={wordSelection.findIndex(pos => pos.x === x && pos.y === y)}
                    selectionLength={wordSelection.length}
                  />
                )}
              </div>
            );
          })
        ))}
      </div>
      
      {/* Selection path visualization */}
      {wordSelection.length > 1 && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <path 
            d={wordSelection.map((pos, i) => {
              const cellWidth = 100 / grid[0].length;
              const cellHeight = 100 / grid.length;
              const x = (pos.x * cellWidth) + (cellWidth / 2);
              const y = (pos.y * cellHeight) + (cellHeight / 2);
              return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
            }).join(' ')}
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export default Board;