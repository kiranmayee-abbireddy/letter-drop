// @ts-ignore - Some TS configs might complain without explicit types for JSON modules
import englishWords from 'an-array-of-english-words';

// Create a fast lookup Set from the imported JSON array
const wordSet = new Set(englishWords);

// Validate if a word exists and is long enough
export const validateWord = (word: string): boolean => {
  const cleanWord = word.toLowerCase();

  if (cleanWord.length <= 2) {
    return false;
  }

  return wordSet.has(cleanWord);
};