import React from 'react';

interface LetterProps {
  letter: string;
  isActive: boolean;
  isSelected: boolean;
  position: number;
  selectionLength: number;
}

const Letter: React.FC<LetterProps> = ({ letter, isActive, isSelected, position, selectionLength }) => {
  // Calculate color based on letter rarity
  const getLetterColor = (letter: string) => {
    const rareLetters = ['J', 'K', 'Q', 'X', 'Z'];
    const uncommonLetters = ['B', 'C', 'F', 'G', 'M', 'P', 'V', 'W', 'Y'];
    
    if (rareLetters.includes(letter)) {
      return 'from-pink-500 to-purple-700'; // Rare letters
    } else if (uncommonLetters.includes(letter)) {
      return 'from-blue-500 to-indigo-700'; // Uncommon letters
    } else {
      return 'from-emerald-500 to-teal-700'; // Common letters
    }
  };
  
  // Calculate selection gradient position
  const getSelectionGradient = () => {
    if (!isSelected || selectionLength <= 1) return '';
    
    const hue = (position / selectionLength) * 270; // Gradient from 0 to 270 degrees
    return `hsl(${hue}, 100%, 70%)`;
  };
  
  return (
    <div
      className={`
        w-full h-full flex items-center justify-center rounded-md font-bold text-white
        ${isActive ? 'animate-pulse' : ''}
        ${isSelected ? 'ring-2 ring-white scale-95' : 'scale-100'}
        bg-gradient-to-br ${getLetterColor(letter)}
        transition-all duration-150 ease-in-out
      `}
      style={{
        boxShadow: isSelected ? `0 0 10px ${getSelectionGradient()}` : 'none',
        borderColor: getSelectionGradient(),
      }}
    >
      {letter}
      {isSelected && (
        <div className="absolute top-0 right-0 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs text-purple-800 font-bold">
          {position + 1}
        </div>
      )}
    </div>
  );
};

export default Letter;