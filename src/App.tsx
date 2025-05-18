import React from 'react';
import Game from './components/Game';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 mt-6">Letter Drop</h1>
      <p className="text-purple-200 text-sm mb-6 italic">by Kiryee</p>
      <Game />
    </div>
  );
}

export default App;