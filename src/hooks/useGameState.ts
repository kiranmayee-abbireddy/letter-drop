import { useState, useCallback } from 'react';
import { validateWord } from '../utils/wordValidator';
import { generateNextLetter, calculateWordScore } from '../utils/gameLogic';
import { LetterPosition } from '../utils/types';
import { playSound } from '../utils/soundManager';

export const useGameState = (rows: number, cols: number) => {
  // Create initial empty grid
  const createEmptyGrid = useCallback(() => {
    return Array(rows).fill(null).map(() =>
      Array(cols).fill(null)
    );
  }, [rows, cols]);

  // Game state
  const [grid, setGrid] = useState<(string | null)[][]>(createEmptyGrid());
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [nextLetter, setNextLetter] = useState<string>(generateNextLetter(1));
  const [activeLetter, setActiveLetter] = useState<LetterPosition | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [wordSelection, setWordSelection] = useState<{ x: number, y: number }[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 2000);
  }, []);

  // Move the active letter left or right
  const moveActiveLetter = useCallback((direction: number) => {
    if (!activeLetter || paused) return;

    const newX = activeLetter.x + direction;

    // Check if the new position is valid
    if (newX >= 0 && newX < cols && grid[activeLetter.y][newX] === null) {
      setActiveLetter({
        ...activeLetter,
        x: newX
      });
    }
  }, [activeLetter, grid, paused]);

  // Drop the active letter all the way down
  const dropActiveLetter = useCallback(() => {
    if (!activeLetter || paused) return;

    let newY = activeLetter.y;

    // Find the lowest valid position
    while (newY + 1 < rows && grid[newY + 1][activeLetter.x] === null) {
      newY++;
    }

    setActiveLetter({
      ...activeLetter,
      y: newY
    });
  }, [activeLetter, grid, paused]);

  // Try to form a word with the selected letters
  const tryWord = useCallback((currentSelection?: { x: number, y: number }[]) => {
    const selection = currentSelection || wordSelection;
    if (selection.length < 3 || paused) {
      setWordSelection([]);
      return;
    }

    // Get the letters from the word selection
    const word = selection.map(pos => grid[pos.y][pos.x]).join('').toLowerCase();

    // Validate the word
    if (validateWord(word)) {
      // Word is valid, calculate score with increased base points
      const wordScore = calculateWordScore(word) * 1.5; // 50% score increase
      setScore(prev => prev + wordScore);

      // Apply gravity - make letters fall to fill empty spaces
      const newGrid = [...grid.map(row => [...row])];
      selection.forEach(pos => {
        newGrid[pos.y][pos.x] = null;
      });

      showMessage(`+${Math.floor(wordScore)} ${word.toUpperCase()}!`);

      // Apply gravity - make letters fall to fill empty spaces
      for (let x = 0; x < cols; x++) {
        let emptySpaces = 0;

        for (let y = rows - 1; y >= 0; y--) {
          if (newGrid[y][x] === null) {
            emptySpaces++;
          } else if (emptySpaces > 0) {
            // Move letter down by the number of empty spaces
            newGrid[y + emptySpaces][x] = newGrid[y][x];
            newGrid[y][x] = null;
          }
        }
      }

      setGrid(newGrid);
      setWordSelection([]);
      playSound('clearWord');

      // Level up more slowly - every 75 points instead of 50
      const newLevel = Math.floor(score / 75) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        playSound('levelUp');
      }
    } else {
      // Word is invalid
      setWordSelection([]);
      playSound('invalidWord');
      showMessage(`Invalid word: ${word.toUpperCase()}`);
    }
  }, [wordSelection, grid, score, level, paused, showMessage, rows, cols]);

  // Reset the game
  const resetGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setScore(0);
    setLevel(1);
    setNextLetter(generateNextLetter(1));
    setActiveLetter(null);
    setGameOver(false);
    setPaused(false);
    setWordSelection([]);
  }, []);

  return {
    grid,
    score,
    level,
    nextLetter,
    activeLetter,
    gameOver,
    paused,
    wordSelection,
    setGrid,
    setScore,
    setLevel,
    setNextLetter,
    setActiveLetter,
    setGameOver,
    setPaused,
    setWordSelection,
    moveActiveLetter,
    dropActiveLetter,
    tryWord,
    resetGame,
    message
  };
};