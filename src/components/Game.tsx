import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RefreshCw, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import GameOver from './GameOver';
import Tutorial from './Tutorial';
import { useGameState } from '../hooks/useGameState';
import { generateNextLetter } from '../utils/gameLogic';
import { playSound, playBackgroundMusic, pauseBackgroundMusic, stopBackgroundMusic } from '../utils/soundManager';

const Game: React.FC = () => {
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
    resetGame
  } = useGameState();
  
  const [muted, setMuted] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
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
    
    const handleTouchStart = (e: TouchEvent) => {
      if (!activeLetter || paused || gameOver) return;
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!activeLetter || paused || gameOver) return;
      const touchCurrentX = e.touches[0].clientX;
      const diff = touchCurrentX - touchStartX;
      
      if (diff > 30) {
        moveActiveLetter(1);
        touchStartX = touchCurrentX;
      } else if (diff < -30) {
        moveActiveLetter(-1);
        touchStartX = touchCurrentX;
      }
    };
    
    const handleTouchEnd = () => {
      if (!activeLetter || paused || gameOver) return;
      dropActiveLetter();
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
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-2 px-4">
        <ScoreBoard score={score} level={level} />
        
        <div className="flex space-x-3">
          <button 
            className="text-white hover:text-purple-300 transition-colors"
            onClick={toggleSound}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <button 
            className="text-white hover:text-purple-300 transition-colors"
            onClick={() => setShowTutorial(true)}
            aria-label="Show tutorial"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
      
      <div className="relative w-full">
        <div className="bg-purple-800 bg-opacity-50 rounded-lg p-2 mb-2 flex justify-center">
          <div className="w-10 h-10 flex items-center justify-center bg-purple-700 rounded-md">
            <span className="text-white text-lg font-bold">{nextLetter}</span>
          </div>
        </div>
        
        <div ref={boardRef}>
          <Board 
            grid={grid} 
            activeLetter={activeLetter} 
            wordSelection={wordSelection}
            setWordSelection={setWordSelection}
            tryWord={tryWord}
            gameOver={gameOver}
          />
        </div>
        
        <div className="mt-4 flex justify-center space-x-6">
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-colors"
            onClick={() => setPaused(!paused)}
            disabled={gameOver}
            aria-label={paused ? "Resume game" : "Pause game"}
          >
            {paused ? <Play size={24} /> : <Pause size={24} />}
          </button>
          
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-colors"
            onClick={resetGame}
            aria-label="Restart game"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </div>
      
      {gameOver && <GameOver score={score} resetGame={resetGame} />}
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
    </div>
  );
};

export default Game;