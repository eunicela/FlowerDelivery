import { useStore } from '../lib/store';

export default function MusicPlayer() {
  const { isMusicPlaying, toggleMusic } = useStore();

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
      {/* Spinning CD */}
      <button
        onClick={toggleMusic}
        className="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-transform focus:outline-none"
        aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
      >
        {/* CD outer ring */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 shadow-lg ${
            isMusicPlaying ? 'animate-spin-slow' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 25%, #1a1a1a 50%, #4a4a4a 75%, #1a1a1a 100%)',
          }}
        >
          {/* CD grooves */}
          <div className="absolute inset-2 rounded-full border border-gray-600 opacity-30" />
          <div className="absolute inset-4 rounded-full border border-gray-600 opacity-30" />
          <div className="absolute inset-6 rounded-full border border-gray-600 opacity-30" />

          {/* CD center hole */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border-2 border-gray-400 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-600" />
            </div>
          </div>

          {/* CD reflection/shine */}
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
            }}
          />
        </div>

        {/* Play/Pause indicator */}
        {!isMusicPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[8px] border-l-gray-800 border-y-[5px] border-y-transparent ml-1" />
            </div>
          </div>
        )}
      </button>

      {/* Song info */}
      <div className="text-left">
        <p className="font-cursive text-sm text-cream-white drop-shadow-md leading-tight">
          From the Start
        </p>
        <p className="font-serif text-xs text-cream-white/70 drop-shadow-md">
          Laufey
        </p>
      </div>
    </div>
  );
}
