// Native Web Audio Synthesizer (Zero-latency, offline, no dead links)

let audioCtx: AudioContext | null = null;
let bgMusicInterval: number | null = null;
let isMuted = true;

// Initialize AudioContext lazily on first interaction
const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Play a synthesized sound effect
export const playSound = (name: string) => {
  if (isMuted) return;
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  const t = ctx.currentTime;

  switch (name) {
    case 'drop':
      // Playful pop bubble
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
      gainNode.gain.setValueAtTime(0.3, t);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
      break;

    case 'land':
      // Soft thud
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
      gainNode.gain.setValueAtTime(0.4, t);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
      break;

    case 'clearWord':
      // Happy crystalline chime (C major arpeggio)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.setValueAtTime(659.25, t + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, t + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, t + 0.3); // C6

      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.2, t + 0.05);
      gainNode.gain.setValueAtTime(0.2, t + 0.35);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
      osc.start(t);
      osc.stop(t + 0.6);
      break;

    case 'invalidWord':
      // Harsh buzzer
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.setValueAtTime(110, t + 0.15);
      gainNode.gain.setValueAtTime(0.2, t);
      gainNode.gain.setValueAtTime(0.2, t + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
      break;

    case 'levelUp':
      // Bright fanfare
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, t); // A4
      osc.frequency.setValueAtTime(554.37, t + 0.15); // C#5
      osc.frequency.setValueAtTime(659.25, t + 0.3); // E5
      gainNode.gain.setValueAtTime(0.15, t);
      gainNode.gain.linearRampToValueAtTime(0.01, t + 0.7);
      osc.start(t);
      osc.stop(t + 0.7);
      break;

    case 'gameOver':
      // Sad descending trombones
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 1.2);
      gainNode.gain.setValueAtTime(0.3, t);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
      osc.start(t);
      osc.stop(t + 1.2);
      break;

    case 'button':
      // Clean UI click
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, t);
      gainNode.gain.setValueAtTime(0.1, t);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
      osc.start(t);
      osc.stop(t + 0.05);
      break;
  }
};

// Retro Ambient Arpeggiator Music Loop
const playMusicNote = (freq: number, type: OscillatorType, dur: number) => {
  if (isMuted) return;
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  // Soft ambient filter
  filter.type = 'lowpass';
  filter.frequency.value = 800;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const t = ctx.currentTime;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.05, t + 0.1); // Very quiet
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.start(t);
  osc.stop(t + dur);
};

export const playBackgroundMusic = () => {
  isMuted = false;
  if (bgMusicInterval) return;

  // Dm9 Ambient chord progression sequence
  const melody = [
    293.66, // D4
    349.23, // F4
    440.00, // A4
    523.25, // C5
    349.23, // F4
    440.00, // A4
    659.25, // E5
    440.00  // A4
  ];

  let step = 0;

  // Play the first note immediately to unblock audio context safely
  getContext();

  bgMusicInterval = window.setInterval(() => {
    if (isMuted) return;

    // Play a soft pluck
    playMusicNote(melody[step], 'sine', 0.8);

    // Add an ethereal bass note every 4 beats
    if (step === 0) {
      playMusicNote(146.83, 'triangle', 2.0); // D3
    } else if (step === 4) {
      playMusicNote(130.81, 'triangle', 2.0); // C3
    }

    step = (step + 1) % melody.length;
  }, 400); // 150 BPM eighth notes
};

export const pauseBackgroundMusic = () => {
  isMuted = true;
};

export const stopBackgroundMusic = () => {
  isMuted = true;
  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }
};