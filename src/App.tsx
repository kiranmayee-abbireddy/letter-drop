import { useState, useEffect } from 'react';
import Game from './components/Game';

function App() {
  const [dimensions, setDimensions] = useState({ rows: 10, cols: 8, measured: false });

  useEffect(() => {
    const updateDimensions = () => {
      const cellPx = 44; // 40px cell + 4px gap
      const paddingW = 32; // horizontal padding
      const headerH = 220; // Title + buttons + next/score + bottom padding

      const cols = Math.max(5, Math.floor((window.innerWidth - paddingW) / cellPx));
      const rows = Math.max(7, Math.floor((window.innerHeight - headerH) / cellPx));

      setDimensions(prev => {
        if (prev.rows !== rows || prev.cols !== cols || !prev.measured) {
          return { rows, cols, measured: true };
        }
        return prev;
      });
    };

    updateDimensions();
    let timeoutId: number;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateDimensions, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!dimensions.measured) {
    return <div className="h-[100dvh] w-full bg-gradient-to-b from-gray-900 to-purple-900" />;
  }

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-gray-900 to-purple-900 flex flex-col items-center justify-start overflow-hidden pt-3 pb-2 overscroll-none touch-none px-4">
      <div className="flex-1 w-full min-h-0 flex flex-col items-center justify-start relative max-w-7xl mx-auto">
        <Game key={`${dimensions.rows}-${dimensions.cols}`} rows={dimensions.rows} cols={dimensions.cols} />
      </div>
    </div>
  );
}

export default App;