import React from 'react';
import { X, ArrowLeft, ArrowRight, ArrowDown, MousePointer } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-purple-800 to-indigo-900 p-6 rounded-xl shadow-lg w-full max-w-sm mx-4 relative max-h-[90vh] overflow-y-auto scrollbar-hide flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-purple-300"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white text-center mb-6">How to Play</h2>

        <div className="space-y-6 text-purple-100">
          <div>
            <h3 className="font-bold text-white mb-2">Controls</h3>
            <div className="flex items-center mb-3">
              <div className="flex space-x-1 mr-3 flex-shrink-0">
                <div className="w-8 h-8 flex items-center justify-center bg-purple-700 rounded">
                  <ArrowLeft size={16} />
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-purple-700 rounded">
                  <ArrowRight size={16} />
                </div>
              </div>
              <span className="leading-snug">Drag letter or tap an empty column to move</span>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-700 rounded mr-3 flex-shrink-0">
                <ArrowDown size={16} />
              </div>
              <span className="leading-snug">Press down arrow or swipe down to drop faster</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-700 rounded mr-3 flex-shrink-0">
                <MousePointer size={16} />
              </div>
              <span className="leading-snug">Tap/Click consecutive adjacent letters, then tap the last one again to submit word</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Game Rules</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Letters fall one by one from the top</li>
              <li>Move each falling letter left or right before it lands</li>
              <li>Form words by selecting adjacent letters</li>
              <li>Words must be at least 3 letters long</li>
              <li>Longer words give more points</li>
              <li>Rare letters (J, K, Q, X, Z) give bonus points</li>
              <li>Game ends if the stack reaches the top</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Scoring</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>3-letter word: 10 points</li>
              <li>Each additional letter: +5 points</li>
              <li>Rare letters: +3 points each</li>
              <li>Uncommon letters: +1 point each</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Start Playing
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;