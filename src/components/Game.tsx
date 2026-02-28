import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RefreshCw, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import GameOver from './GameOver';
import Tutorial from './Tutorial';
import { useGameState } from '../hooks/useGameState';
import { generateNextLetter } from '../utils/gameLogic';
import { playSound, playBackgroundMusic, pauseBackgroundMusic, stopBackgroundMusic } from '../utils/soundManager';

interface GameProps {
  rows: number;
  cols: number;
}

const Game: React.FC<GameProps> = ({ rows, cols }) => {
  const {
    grid,
    score,
    level,
    nextLetter,
    activeLetter,
    gameOver,
    paused,
    wordSelection,
    setGrid,
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
  } = useGameState(rows, cols);

  const [muted, setMuted] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Handle background music based on game state
  useEffect(() => {
    if (!muted && !gameOver && !paused) {
      playBackgroundMusic();
    } else {
      pauseBackgroundMusic();
    }
  }, [muted, gameOver, paused]);

  // Stop background music when component unmounts
  useEffect(() => {
    return () => {
      stopBackgroundMusic();
    };
  }, []);

  // Start a new letter drop
  const startNewDrop = useCallback(() => {
    if (gameOver || paused) return;

    setActiveLetter({
      letter: nextLetter,
      x: Math.floor(grid[0].length / 2),
      y: 0
    });

    setNextLetter(generateNextLetter(level));

    if (!muted) {
      playSound('drop');
    }
  }, [gameOver, paused, nextLetter, grid, level, muted, setActiveLetter, setNextLetter]);

  // Handle the game tick with slower falling speed
  const gameTick = useCallback(() => {
    if (paused || gameOver) return;

    if (activeLetter) {
      // Check if the letter can move down
      const newY = activeLetter.y + 1;
      if (newY >= grid.length || (grid[newY][activeLetter.x] !== null)) {
        // Letter has landed
        const newGrid = [...grid];
        newGrid[activeLetter.y][activeLetter.x] = activeLetter.letter;
        setGrid(newGrid);
        setActiveLetter(null);

        // Check if game is over (stack reached the top)
        if (activeLetter.y === 0) {
          setGameOver(true);
          if (!muted) {
            playSound('gameOver');
            stopBackgroundMusic();
          }
          return;
        }

        if (!muted) {
          playSound('land');
        }

        // Start a new drop after a longer delay
        setTimeout(() => {
          startNewDrop();
        }, 400); // Increased from 300ms
      } else {
        // Move letter down
        setActiveLetter({
          ...activeLetter,
          y: newY
        });
      }
    } else if (!gameOver) {
      startNewDrop();
    }
  }, [activeLetter, grid, paused, gameOver, muted, setGrid, setActiveLetter, setGameOver, startNewDrop]);

  // Set up the game interval with slower base speed
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Calculate interval based on level (gets faster more slowly)
    const interval = Math.max(300, 1200 - (level * 40)); // Slower initial speed and gentler acceleration

    intervalRef.current = window.setInterval(gameTick, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameTick, level]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === 'p') {
        setPaused(!paused);
      } else if (paused) {
        return;
      }

      if (activeLetter) {
        if (e.key === 'ArrowLeft') {
          moveActiveLetter(-1);
        } else if (e.key === 'ArrowRight') {
          moveActiveLetter(1);
        } else if (e.key === 'ArrowDown' || e.key === ' ') {
          dropActiveLetter();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeLetter, gameOver, paused, setPaused, moveActiveLetter, dropActiveLetter]);

  // Touch controls
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (!activeLetter || paused || gameOver) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!activeLetter || paused || gameOver) return;
      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;

      const diffX = touchCurrentX - touchStartX;
      const diffY = touchCurrentY - touchStartY;

      // Detect swipe down
      if (diffY > 40 && Math.abs(diffY) > Math.abs(diffX)) {
        dropActiveLetter();
        touchStartY = touchCurrentY; // Reset to avoid multiple drops
      }
      // Detect swipe horizontal
      else if (diffX > 30) {
        moveActiveLetter(1);
        touchStartX = touchCurrentX;
      } else if (diffX < -30) {
        moveActiveLetter(-1);
        touchStartX = touchCurrentX;
      }
    };

    const handleTouchEnd = () => {
      // We don't drop automatically on touch end anymore,
      // it's handled by tracking swipe vertical distance in move
    };

    if (boardRef.current) {
      const board = boardRef.current;
      board.addEventListener('touchstart', handleTouchStart);
      board.addEventListener('touchmove', handleTouchMove);
      board.addEventListener('touchend', handleTouchEnd);

      return () => {
        board.removeEventListener('touchstart', handleTouchStart);
        board.removeEventListener('touchmove', handleTouchMove);
        board.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [activeLetter, paused, gameOver, moveActiveLetter, dropActiveLetter]);

  // Toggle sound
  const toggleSound = () => {
    setMuted(!muted);
    if (muted) {
      playSound('button');
      playBackgroundMusic();
    } else {
      pauseBackgroundMusic();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {/* HEADER SECTION */}
      <div className="w-full flex-shrink-0 flex flex-col gap-2 mb-4 mt-2">
        {/* Top bar: Title & secondary actions */}
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mt-0">Letter Drop</h1>
            <p className="text-purple-200 text-xs italic">by Kiryee</p>
          </div>
          <div className="flex space-x-3 bg-purple-800 bg-opacity-40 p-2 rounded-lg">
            <button
              className="text-white hover:text-purple-300 transition-colors"
              onClick={toggleSound}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              className="text-white hover:text-purple-300 transition-colors"
              onClick={resetGame}
              aria-label="Restart game"
            >
              <RefreshCw size={20} />
            </button>
            <button
              className="text-white hover:text-purple-300 transition-colors"
              onClick={() => {
                setPaused(true);
                setShowTutorial(true);
              }}
              aria-label="Show tutorial"
            >
              <HelpCircle size={20} />
            </button>
            <button
              className="text-white hover:text-purple-300 transition-colors"
              onClick={() => setPaused(!paused)}
              disabled={gameOver}
              aria-label={paused ? "Resume game" : "Pause game"}
            >
              {paused ? <Play size={20} /> : <Pause size={20} />}
            </button>
          </div>
        </div>

        {/* Score & Next Letter bar */}
        <div className="w-full flex items-center justify-between bg-purple-800 bg-opacity-40 rounded-lg py-2 px-4 shadow-sm">
          <ScoreBoard score={score} level={level} />
          <div className="flex flex-col items-end">
            <span className="text-xs text-purple-300 mb-1 uppercase tracking-wider font-semibold">Next</span>
            <div className="w-10 h-10 flex items-center justify-center bg-purple-700 rounded shadow-inner border border-purple-600">
              <span className="text-white text-lg font-bold">{nextLetter}</span>
            </div>
          </div>
        </div>
      </div>

      {/* GAME BOARD SECTION */}
      <div className="w-full flex-1 flex flex-col min-h-0 relative touch-none pb-2 items-center" ref={boardRef}>

        {/* Message Toast */}
        <div className="h-8 mb-2 flex items-center justify-center w-full">
          {message && (
            <div className={`px-4 py-1 rounded-full text-sm font-bold animate-pulse text-white shadow-lg ${message.startsWith('Invalid') ? 'bg-red-500' : 'bg-green-500'}`}>
              {message}
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 w-full h-full flex items-center justify-center">
          <Board
            grid={grid}
            activeLetter={activeLetter}
            wordSelection={wordSelection}
            setWordSelection={setWordSelection}
            tryWord={tryWord}
            gameOver={gameOver}
            setColumn={(x) => {
              if (activeLetter && !paused && grid[activeLetter.y][x] === null) {
                setActiveLetter({ ...activeLetter, x });
              }
            }}
          />
        </div>
      </div>

      {gameOver && <GameOver score={score} resetGame={resetGame} />}
      {showTutorial && <Tutorial onClose={() => {
        setShowTutorial(false);
        setPaused(false);
      }} />}
    </div>
  );
};

export default Game;