// Letter frequency based roughly on English language frequency
const LETTER_DISTRIBUTION = {
  common: ['A', 'E', 'I', 'O', 'U', 'N', 'R', 'S', 'T', 'L', 'D', 'H'],
  uncommon: ['B', 'C', 'F', 'G', 'M', 'P', 'V', 'W', 'Y'],
  rare: ['J', 'K', 'Q', 'X', 'Z']
};

// Adjusted weights to favor common letters more heavily
const LETTER_WEIGHTS = {
  common: 0.8,    // Increased from 0.7
  uncommon: 0.15, // Decreased from 0.25
  rare: 0.05      // Kept the same
};

// Generate a random letter based on distribution
export const generateNextLetter = (level: number): string => {
  // Adjust weights based on level (more gradual progression)
  let weights = { ...LETTER_WEIGHTS };
  
  if (level > 7) { // Changed from level 5 to level 7
    // Slower progression of difficulty
    weights.common = Math.max(0.7, weights.common - (level - 7) * 0.01);  // Reduced rate of change
    weights.uncommon = Math.min(0.25, weights.uncommon + (level - 7) * 0.008);
    weights.rare = Math.min(0.1, weights.rare + (level - 7) * 0.002);
  }
  
  const randomValue = Math.random();
  let category;
  
  if (randomValue < weights.common) {
    category = LETTER_DISTRIBUTION.common;
  } else if (randomValue < weights.common + weights.uncommon) {
    category = LETTER_DISTRIBUTION.uncommon;
  } else {
    category = LETTER_DISTRIBUTION.rare;
  }
  
  // Pick a random letter from the chosen category
  return category[Math.floor(Math.random() * category.length)];
};

// Calculate score for a valid word with increased base scores
export const calculateWordScore = (word: string): number => {
  const wordLength = word.length;
  let baseScore = 0;
  
  // Increased base scores
  if (wordLength === 3) {
    baseScore = 15;  // Increased from 10
  } else {
    baseScore = 15 + ((wordLength - 3) * 8);  // Increased from 5 to 8 points per additional letter
  }
  
  // Increased bonus for rare/uncommon letters
  let bonusPoints = 0;
  for (const char of word.toUpperCase()) {
    if (LETTER_DISTRIBUTION.rare.includes(char)) {
      bonusPoints += 5; // Increased from 3
    } else if (LETTER_DISTRIBUTION.uncommon.includes(char)) {
      bonusPoints += 2; // Increased from 1
    }
  }
  
  return baseScore + bonusPoints;
};