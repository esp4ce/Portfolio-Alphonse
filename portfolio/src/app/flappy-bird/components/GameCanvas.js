"use client";
import { CANVAS_BASE_HEIGHT, CANVAS_BASE_WIDTH } from "../constants";

export default function GameCanvas({ canvasRef, canvasSize, onClick, onTouchStart, isGameStarted, isGameOver, score, highScore, isMusicPlaying, onToggleMusic, onRestart, onLeaderboard, onHome, showLeaderboardModal, onSubmitLeaderboard, onCloseModal, submitLoading, submitError }) {
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_BASE_WIDTH}
        height={CANVAS_BASE_HEIGHT}
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          maxWidth: '100%',
          maxHeight: '100%',
          touchAction: 'none',
          userSelect: 'none'
        }}
        className="border border-gray-800 shadow-2xl bg-black rounded-lg"
        onClick={onClick}
        onTouchStart={onTouchStart}
      />

      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-white">
        {isGameStarted && !isGameOver && (
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{score}</div>
        )}
        
      </div>

      <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleMusic(); }}
          className={`p-2 rounded-full transition-all duration-200 ${isMusicPlaying ? "bg-green-600 bg-opacity-70 hover:bg-opacity-90" : "bg-black bg-opacity-50 hover:bg-opacity-70"}`}
          aria-label={isMusicPlaying ? "Arrêter la musique" : "Démarrer la musique"}
        >
          {/* Icônes inline pour éviter dépendance */}
          {isMusicPlaying ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          )}
        </button>
      </div>

      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 rounded-lg">
          <div className="text-center space-y-6 px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">GAME OVER</h2>
            <div className="text-white text-xl font-bold">Score: <span className="font-bold">{score}</span></div>
           
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button onClick={onRestart} className="px-5 py-2 text-white font-bold tracking-wide hover:scale-110 transition-transform uppercase">Restart</button>
              <button
                onClick={() => {
                  if (score <= 0) {
                    alert("You need a positive score to submit to the leaderboard.");
                    return;
                  }
                  onLeaderboard();
                }}
                disabled={score <= 0}
                className={`px-5 py-2 text-white font-bold tracking-wide transition-transform uppercase ${score <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
              >
                Add to leaderboard
              </button>
              <button onClick={onHome} className="px-5 py-2 text-white font-bold tracking-wide hover:scale-110 transition-transform uppercase">Home</button>
            </div>
          </div>
        </div>
      )}

      {showLeaderboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
          <div className="bg-black p-6 rounded-lg border border-gray-800 w-full max-w-sm">
            <h3 className="text-white text-2xl font-bold mb-4 text-center">ADD TO LEADERBOARD</h3>
            <form onSubmit={onSubmitLeaderboard} className="space-y-4">
              <input
                name="nickname"
                className="w-full px-3 py-2 bg-transparent text-white placeholder-gray-400 border-b border-gray-700 focus:border-white focus:outline-none transition"
                autoComplete="off"
                maxLength={24}
              />
              {submitError && <div className="text-red-400 text-sm">{submitError}</div>}
              <div className="flex gap-3 justify-center">
                <button type="submit" disabled={submitLoading} className="px-5 py-2 text-white font-bold tracking-wide hover:scale-110 transition-transform uppercase disabled:opacity-50">{submitLoading ? 'Saving...' : 'Submit'}</button>
                <button type="button" onClick={onCloseModal} disabled={submitLoading} className="px-5 py-2 text-white font-bold tracking-wide hover:scale-110 transition-transform uppercase disabled:opacity-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



