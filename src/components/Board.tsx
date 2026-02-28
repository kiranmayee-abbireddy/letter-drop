import React, { useEffect, useRef } from 'react';
import Letter from './Letter';
import { LetterPosition } from '../utils/types';

interface BoardProps {
  grid: (string | null)[][];
  activeLetter: LetterPosition | null;
  wordSelection: { x: number, y: number }[];
  setWordSelection: React.Dispatch<React.SetStateAction<{ x: number, y: number }[]>>;
  tryWord: (selection?: { x: number, y: number }[]) => void;
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
  const currentSelectionRef = useRef<{ x: number, y: number }[]>([]);

  // Sync prop selection to ref if the parent clears it
  useEffect(() => {
    currentSelectionRef.current = wordSelection;
  }, [wordSelection]);

  const updateSelection = (newSel: { x: number, y: number }[]) => {
    currentSelectionRef.current = newSel;
    setWordSelection(newSel);
  };

  // Helper to check if a cell is part of the current selection
  const isSelected = (x: number, y: number) => {
    return wordSelection.some(pos => pos.x === x && pos.y === y);
  };

  // Helper to check if a cell is adjacent to the last selected cell
  const isAdjacent = (x: number, y: number) => {
    const selection = currentSelectionRef.current;
    if (selection.length === 0) return true;

    const last = selection[selection.length - 1];
    const dx = Math.abs(last.x - x);
    const dy = Math.abs(last.y - y);

    // Adjacent horizontally, vertically, or diagonally
    return (dx <= 1 && dy <= 1) && !(dx === 0 && dy === 0);
  };

  // Handle cell click
  const handleCellClick = (x: number, y: number) => {
    if (gameOver || grid[y][x] === null) return;

    const selection = currentSelectionRef.current;

    if (selection.length > 0) {
      const last = selection[selection.length - 1];

      // If clicking the last letter again, try submitting the word
      if (last.x === x && last.y === y) {
        tryWord(selection);
        return;
      }

      // If clicking a previously selected letter, backtrack to it
      const index = selection.findIndex(pos => pos.x === x && pos.y === y);
      if (index !== -1) {
        updateSelection(selection.slice(0, index + 1));
        return;
      }

      // If clicking an adjacent letter, add it to selection
      if (isAdjacent(x, y)) {
        updateSelection([...selection, { x, y }]);
        return;
      }
    }

    // Otherwise, start a new selection (e.g. clicking a non-adjacent letter or first click)
    updateSelection([{ x, y }]);
  };

  return (
    <div className="relative bg-purple-800 bg-opacity-30 backdrop-blur-sm p-1.5 md:p-2.5 rounded-lg overflow-hidden touch-none shadow-2xl border border-purple-500 border-opacity-20 inline-block mx-auto">
      <div className="grid gap-[4px] relative" style={{
        gridTemplateColumns: `repeat(${grid[0].length}, 40px)`,
        gridTemplateRows: `repeat(${grid.length}, 40px)`
      }}>
        {grid.map((row, y) => (
          row.map((cell, x) => {
            // Determine if this cell is the active falling letter
            const isActive = activeLetter?.x === x && activeLetter?.y === y;
            const selected = isSelected(x, y);

            return (
              <div
                key={`${x}-${y}`}
                className="w-full h-full cursor-pointer rounded-lg"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleCellClick(x, y);
                }}
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