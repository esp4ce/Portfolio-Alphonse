"use client";
import { useRef, useState, useEffect, useCallback } from "react";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const startMusic = useCallback(() => {
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(console.error);
    }
  }, [isMusicPlaying]);

  const stopMusic = useCallback(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }
  }, [isMusicPlaying]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      startMusic();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [startMusic]);

  return (
    <>
      <audio ref={audioRef} preload="auto" loop>
        <source src="/music/Intro - Reymour.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {/* Fournit une API de contrôle via CustomEvent si nécessaire plus tard */}
      <script dangerouslySetInnerHTML={{ __html: `
        window.__flappyAudio = {
          play: () => document.querySelector('audio')?.play(),
          pause: () => document.querySelector('audio')?.pause(),
        };
      ` }} />
    </>
  );
}



