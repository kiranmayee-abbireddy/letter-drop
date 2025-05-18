import React, { useEffect, useState } from 'react';

interface ScoreBoardProps {
  score: number;
  level: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, level }) => {
  const [animateScore, setAnimateScore] = useState(false);
  const [prevScore, setPrevScore] = useState(score);
  
  useEffect(() => {
    if (score > prevScore) {
      setAnimateScore(true);
      const timer = setTimeout(() => {
        setAnimateScore(false);
      }, 500);
      
      setPrevScore(score);
      return () => clearTimeout(timer);
    }
  }, [score, prevScore]);
  
  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold text-white flex items-center">
        <span className={`transition-all ${animateScore ? 'scale-125 text-yellow-300' : 'scale-100'}`}>
          {score}
        </span>
        <span className="text-purple-300 text-xs ml-1">pts</span>
      </div>
      <div className="text-sm text-purple-300">
        Level: {level}
      </div>
    </div>
  );
};

export default ScoreBoard;