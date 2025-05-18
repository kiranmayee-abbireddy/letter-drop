// Sound manager utility using online audio files

const SOUNDS = {
  drop: 'https://assets.mixkit.co/active_storage/sfx/2205/2205-preview.mp3', // Playful pop
  land: 'https://assets.mixkit.co/active_storage/sfx/1357/1357-preview.mp3', // Bouncy land
  clearWord: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Success chime
  invalidWord: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Error beep
  levelUp: 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3', // Achievement
  gameOver: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3', // Game over
  button: 'https://assets.mixkit.co/active_storage/sfx/2576/2576-preview.mp3', // Click
  bgMusic: 'https://assets.mixkit.co/active_storage/sfx/2335/2335-preview.mp3' // Playful background music
};

// Audio elements cache
const audioCache = new Map();
let bgMusic: HTMLAudioElement | null = null;

// Initialize audio elements
const initAudio = (soundName: string, url: string) => {
  const audio = new Audio(url);
  audio.preload = 'auto';
  return audio;
};

// Initialize background music
const initBackgroundMusic = () => {
  if (!bgMusic && SOUNDS.bgMusic) {
    bgMusic = new Audio(SOUNDS.bgMusic);
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
  }
  return bgMusic;
};

// Play a sound by name
export const playSound = (name: string) => {
  try {
    if (!audioCache.has(name) && SOUNDS[name]) {
      audioCache.set(name, initAudio(name, SOUNDS[name]));
    }

    const audio = audioCache.get(name);
    if (audio) {
      // Reset and play
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.warn('Audio playback failed:', err);
      });
    }
  } catch (e) {
    console.error('Sound playback error:', e);
  }
};

// Control background music
export const playBackgroundMusic = () => {
  const music = initBackgroundMusic();
  if (music) {
    music.play().catch(err => {
      console.warn('Background music playback failed:', err);
    });
  }
};

export const pauseBackgroundMusic = () => {
  if (bgMusic) {
    bgMusic.pause();
  }
};

export const stopBackgroundMusic = () => {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
};