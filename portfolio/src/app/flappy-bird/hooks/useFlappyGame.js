"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  CANVAS_BASE_HEIGHT,
  CANVAS_BASE_WIDTH,
  DESKTOP_MIN_DELAY_MS,
  GAME_OVER_DELAY_MS,
  GRAVITY,
  INITIAL_PIPES,
  JUMP_VELOCITY,
  MOBILE_MIN_DELAY_MS,
  PIPE_SPEED,
  PIPE_SPACING,
  PIPE_WIDTH,
  BIRD_INITIAL_X,
  BIRD_INITIAL_Y,
  BIRD_RADIUS,
  SPEED_STEP_SCORE,
  SPEED_INCREMENT,
  MAX_PIPE_SPEED,
  GAP_MIN,
  GAP_MAX,
  CENTER_MIN,
  CENTER_MAX,
} from "../constants";
import { clearAndFillBackground, drawClouds, drawBird as drawBirdGfx, drawPipe, drawParticles, drawStartScreen } from "../utils/draw";

export function useFlappyGame() {
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const birdY = useRef(BIRD_INITIAL_Y);
  const birdX = useRef(BIRD_INITIAL_X);
  const velocity = useRef(0);
  const birdRotation = useRef(0);

  const gameSpeed = useRef(PIPE_SPEED);
  const pipes = useRef([]);
  const particles = useRef([]);
  const gameTime = useRef(0);

  // Variation progressive de la hauteur du centre du gap
  const pipeCenter = useRef((CENTER_MIN + CENTER_MAX) / 2);
  const pipeCenterDelta = useRef(14); // pas vertical lissé
  const pipeIndex = useRef(0);
  const pipeDirection = useRef(1); // 1 descend, -1 monte

  const lastActionTime = useRef(0);
  const gameOverTime = useRef(0);

  const [canvasSize, setCanvasSize] = useState({ width: CANVAS_BASE_WIDTH, height: CANVAS_BASE_HEIGHT });
  const [isMobile, setIsMobile] = useState(false);

  const calculateCanvasSize = useCallback(() => {
    const baseWidth = CANVAS_BASE_WIDTH;
    const baseHeight = CANVAS_BASE_HEIGHT;
    const aspectRatio = baseWidth / baseHeight;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let newWidth = windowWidth;
    let newHeight = windowHeight;

    if (windowWidth < 768) {
      newWidth = windowWidth - 20;
      newHeight = windowHeight - 20;
      if (newWidth / newHeight > aspectRatio) {
        newWidth = newHeight * aspectRatio;
      } else {
        newHeight = newWidth / aspectRatio;
      }
    } else if (windowWidth < 1024) {
      newWidth = Math.min(windowWidth - 80, 600);
      newHeight = newWidth / aspectRatio;
    } else {
      newWidth = Math.min(windowWidth - 100, baseWidth);
      newHeight = newWidth / aspectRatio;
    }

    setCanvasSize({ width: newWidth, height: newHeight });
  }, []);

  useEffect(() => {
    calculateCanvasSize();
    const handleResize = () => calculateCanvasSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateCanvasSize]);

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    pipes.current = INITIAL_PIPES.map(p => ({ ...p }));
  }, []);

  const addJumpParticles = useCallback(() => {
    for (let i = 0; i < 8; i++) {
      particles.current.push({
        x: birdX.current,
        y: birdY.current,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 1,
        life: 40,
        maxLife: 40,
        color: Math.random() > 0.5 ? "#ff6b35" : "#4a4a4a",
      });
    }
  }, []);

  const updateParticles = useCallback((ctx) => {
    particles.current = particles.current.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      return particle.life > 0;
    });
    drawParticles(ctx, particles.current);
  }, []);

  const getGameSpeed = useCallback(() => {
    // Vitesse de base + paliers tous les SPEED_STEP_SCORE points
    const steps = Math.floor(score / SPEED_STEP_SCORE);
    const target = Math.min(PIPE_SPEED + steps * SPEED_INCREMENT, MAX_PIPE_SPEED);
    gameSpeed.current = target;
    return target;
  }, [score]);

  const checkCollisions = useCallback(() => {
    if (birdY.current > CANVAS_BASE_HEIGHT - 25 || birdY.current < 25) return true;

    for (const pipe of pipes.current) {
      const birdLeft = birdX.current - BIRD_RADIUS;
      const birdRight = birdX.current + BIRD_RADIUS;
      const birdTop = birdY.current - BIRD_RADIUS;
      const birdBottom = birdY.current + BIRD_RADIUS;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      const pipeTopGap = pipe.top;
      const pipeBottomGap = CANVAS_BASE_HEIGHT - pipe.bottom;

      if (birdRight > pipeLeft && birdLeft < pipeRight && (birdTop < pipeTopGap || birdBottom > pipeBottomGap)) {
        return true;
      }
    }
    return false;
  }, []);

  const generateNewPipe = useCallback(() => {
    const rightmostPipe = Math.max(...pipes.current.map((pipe) => pipe.x));
    // Gap aléatoire dans la plage
    const gap = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
    // Centre avec variations franches pour casser la ligne droite
    const STEP_BASE = 45; // intensité de variation
    const STEP_VAR = 30;  // aléa additionnel
    pipeIndex.current += 1;
    if (Math.random() < 0.25) {
      pipeDirection.current = -pipeDirection.current;
    }
    const dynamicBoost = Math.sin(pipeIndex.current / 3) * 10;
    const step = STEP_BASE + Math.random() * STEP_VAR + dynamicBoost;
    let nextCenter = pipeCenter.current + pipeDirection.current * step;
    if (nextCenter < CENTER_MIN) {
      nextCenter = CENTER_MIN + (CENTER_MIN - nextCenter) * 0.3;
      pipeDirection.current = 1;
    } else if (nextCenter > CENTER_MAX) {
      nextCenter = CENTER_MAX - (nextCenter - CENTER_MAX) * 0.3;
      pipeDirection.current = -1;
    }
    pipeCenter.current = nextCenter;
    const center = nextCenter;
    const top = center - gap / 2;
    const bottom = CANVAS_BASE_HEIGHT - (center + gap / 2);
    const newPipe = {
      x: rightmostPipe + PIPE_SPACING,
      top,
      bottom,
      passed: false,
    };
    pipes.current.push(newPipe);
  }, []);

  const updateScore = useCallback((inc) => {
    setScore((prev) => prev + inc);
  }, []);

  const handleGameAction = useCallback(() => {
    const now = Date.now();
    const minDelay = isMobile ? MOBILE_MIN_DELAY_MS : DESKTOP_MIN_DELAY_MS;
    if (now - lastActionTime.current < minDelay) return;
    // En état Game Over, ignorer toute interaction (restart uniquement via bouton dédié)
    if (isGameOver) return;
    lastActionTime.current = now;

    if (!isGameStarted && !isGameOver) {
      setIsGameStarted(true);
    } else if (isGameStarted && !isGameOver) {
      velocity.current = JUMP_VELOCITY;
      birdRotation.current = -0.2;
      addJumpParticles();
    }
  }, [addJumpParticles, isGameOver, isGameStarted, isMobile]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleGameAction();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleGameAction]);

  useEffect(() => {
    let rafId;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      clearAndFillBackground(ctx);
      drawClouds(ctx, gameTime.current);

      if (isGameStarted && !isGameOver) {
        velocity.current += GRAVITY;
        birdY.current += velocity.current;
        birdRotation.current = Math.min(birdRotation.current + 0.015, 0.4);

        const currentSpeed = getGameSpeed();
        pipes.current.forEach((pipe, i) => {
          pipe.x -= currentSpeed;
          if (pipe.x + PIPE_WIDTH < birdX.current && !pipe.passed && !isGameOver) {
            pipe.passed = true;
            updateScore(1);
            generateNewPipe();
          }
          if (pipe.x < -50 && pipes.current.length > 6) {
            pipes.current.splice(i, 1);
          }
        });

        const gameEnded = checkCollisions();
        if (gameEnded) {
          setIsGameOver(true);
          gameOverTime.current = Date.now();
          setHighScore((prev) => Math.max(prev, score));
          velocity.current = 0;
        } else {
          updateParticles(ctx);
          gameTime.current++;
          drawBirdGfx(ctx, birdX.current, birdY.current, birdRotation.current, score, isGameOver);
          pipes.current.forEach((pipe) => drawPipe(ctx, pipe));
        }
      } else if (!isGameStarted) {
        drawStartScreen(ctx, (tmpCtx) => drawBirdGfx(tmpCtx, 0, 0, birdRotation.current, score, isGameOver));
      }
      
      if (isGameStarted && !isGameOver) {
        rafId = requestAnimationFrame(loop);
      }
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [checkCollisions, generateNewPipe, getGameSpeed, isGameOver, isGameStarted, score, updateParticles]);

  const restartGame = useCallback(() => {
    setScore(0);
    setIsGameOver(false);
    setIsGameStarted(false);
    birdY.current = BIRD_INITIAL_Y;
    birdX.current = BIRD_INITIAL_X;
    velocity.current = 0;
    birdRotation.current = 0;
    gameSpeed.current = PIPE_SPEED;
    gameTime.current = 0;
    particles.current = [];
    pipes.current = INITIAL_PIPES.map(p => ({ ...p }));
  }, []);

  return {
    canvasRef,
    canvasSize,
    score,
    highScore,
    isGameOver,
    isGameStarted,
    isMobile,
    handleGameAction,
    restartGame,
  };
}



