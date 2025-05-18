import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';

interface GameOverProps {
  score: number;
  resetGame: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, resetGame }) => {
  const [highScore, setHighScore] = useState<number>(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  
  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('letterDropHighScore');
    const currentHighScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;
    setHighScore(currentHighScore);
    
    // Check if we have a new high score
    if (score > currentHighScore) {
      setIsNewHighScore(true);
      localStorage.setItem('letterDropHighScore', score.toString());
      setHighScore(score);
    }
  }, [score]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-purple-800 to-indigo-900 p-6 rounded-xl shadow-lg w-full max-w-sm mx-4">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Game Over</h2>
        
        <div className="flex justify-center my-4">
          <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center">
            <Trophy size={40} className="text-yellow-300" />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-purple-200 mb-2">Your Score</p>
          <p className="text-4xl font-bold text-white mb-2">{score}</p>
          
          {isNewHighScore ? (
            <div className="animate-pulse text-yellow-300 font-bold">New High Score!</div>
          ) : (
            <p className="text-purple-300">High Score: {highScore}</p>
          )}
        </div>
        
        <button
          onClick={resetGame}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
        >
          <RefreshCw size={20} className="mr-2" />
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;