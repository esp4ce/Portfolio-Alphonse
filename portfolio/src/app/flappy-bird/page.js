"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFlappyGame } from "./hooks/useFlappyGame";
import dynamic from "next/dynamic";
import { LoaderCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

// Lazy-load heavy client components to reduce initial bundle
const GameCanvas = dynamic(() => import("./components/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoaderCircle className="animate-spin text-white/80 h-8 w-8 sm:h-10 sm:w-10" />
    </div>
  ),
});

const AudioPlayer = dynamic(() => import("./components/AudioPlayer"), {
  ssr: false,
});

export default function FlappyBird() {
  const {
    canvasRef,
    canvasSize,
    score,
    highScore,
    isGameOver,
    isGameStarted,
    isMobile,
    handleGameAction,
    restartGame,
  } = useFlappyGame();

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const router = useRouter();
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const toggleMusic = () => {
    const audio = document.querySelector('audio');
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsMusicPlaying(true)).catch(console.error);
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  };

  return (
    <main 
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-2 sm:p-4"
    >
      <AudioPlayer />
      <GameCanvas
        canvasRef={canvasRef}
        canvasSize={canvasSize}
        onClick={(e) => { e.stopPropagation(); if (!isMobile) handleGameAction(); }}
        onTouchStart={(e) => { e.stopPropagation(); if (isMobile) handleGameAction(); }}
        isGameStarted={isGameStarted}
        isGameOver={isGameOver}
        score={score}
        highScore={highScore}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
        onRestart={() => restartGame()}
        onLeaderboard={() => { setSubmitError(""); setShowLeaderboardModal(true); }}
        onHome={() => router.push("/")}
        showLeaderboardModal={showLeaderboardModal}
        onSubmitLeaderboard={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const nickname = form.nickname?.value?.trim();
          if (!nickname) { setSubmitError("Pseudo requis"); return; }
          if (!score || score <= 0) { setSubmitError("Score invalide"); return; }
          if (nickname.length > 24) { setSubmitError("Pseudo trop long (24 max)"); return; }
          setSubmitLoading(true);
          setSubmitError("");
          try {
            const res = await fetch("/api/leaderboard", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nickname, score }),
            });
            const body = await res.json();
            if (!res.ok) {
              setSubmitError(body?.error || "Insertion refusée");
            } else {
              setShowLeaderboardModal(false);
              router.push("/flappy-bird/leaderboard");
            }
          } catch (err) {
            console.error(err);
            setSubmitError("Erreur inattendue");
          } finally {
            setSubmitLoading(false);
          }
        }}
        onCloseModal={() => { if (!submitLoading) setShowLeaderboardModal(false); }}
        submitLoading={submitLoading}
        submitError={submitError}
      />
    </main>
  );
}



