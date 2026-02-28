# Letter Drop 🔠

**Letter Drop** is a fast-paced, responsive word-puzzle game built with React, TypeScript, and Tailwind CSS. Letters fall from the top of the grid, and your goal is to chain together adjacent letters to form valid English words before the grid fills up completely!

![Letter Drop Gameplay Demo](public/screenshot.png)

## 🚀 Play Now
**[Live Demo available on GitHub Pages!](https://kiranmayee-abbireddy.github.io/letter-drop/)**

## ✨ Features
* **Fully Responsive Grid Engine**: The 8x10 gameplay board intelligently natively scales using CSS to perfectly fit any display—from narrow smartphones to ultra-wide desktop monitors—without stretching.
* **Native Web Audio Synthesizer**: Custom retro-arcade sound effects (ambient arpeggios, chimes, and drop pops) are built entirely on offline `window.AudioContext` analog oscillators for zero-latency feedback without external MP3s.
* **Massive English Dictionary**: Instant, local, sub-millisecond validation against a 274,000+ length `an-array-of-english-words` dictionary database.
* **Mobile-First Touch Controls**: Fully supports touch devices. Drag letters, tap empty columns to instantly move letters, or swipe down to perform a hard drop.
* **Progressive Difficulty**: Connect larger words to rack up massive multipliers, utilizing rare letters to boost your score as the gravity continuously accelerates.

## 🎮 How to Play
1. Letters fall automatically from the top of the screen.
2. Use **Left / Right** arrows or **Tap** empty columns to move the piece.
3. Press **Down** arrow or **Swipe down** to drop the piece faster.
4. Once letters stack up, **Click / Tap** adjacent letters to form words.
5. Tap the last letter again (or press Enter) to submit the word for points.
6. Don't let the grid reach the very top, or it's game over!

## 🛠️ Local Development

Ensure you have [Node.js](https://nodejs.org/) installed, then follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/kiranmayee-abbireddy/letter-drop.git
   cd letter-drop
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## 🏗️ Tech Stack
* **Vite** (Build Tooling)
* **React 18** (UI Components)
* **TypeScript** (Static Typing)
* **Tailwind CSS 3** (Styling)
* **Lucide React** (Icons)

## 📝 License
This project is open source and available under the standard MIT License.
