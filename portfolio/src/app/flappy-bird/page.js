"use client";
import { useEffect, useRef, useState } from "react";

export default function FlappyBird() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const birdY = useRef(300);
  const birdX = useRef(80);
  const velocity = useRef(0);
  const birdRotation = useRef(0);
  const gravity = 0.4;
  const jump = -6;
  const PIPE_SPEED = 1.5; // Vitesse constante des tuyaux
  const gameSpeed = useRef(PIPE_SPEED);

  const pipes = useRef([]);
  const particles = useRef([]);
  const gameTime = useRef(0);
  const pipesGenerated = useRef(0);
  
  // Dimensions responsive
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 600 });
  const [scale, setScale] = useState(1);
  
  // Protection contre les double sauts
  const lastActionTime = useRef(0);
  
  // Timer pour éviter de skip le game over
  const gameOverTime = useRef(0);
  const GAME_OVER_DELAY = 1000;
  
  // Gestion de la musique de fond
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  // Fonction pour démarrer la musique
  const startMusic = () => {
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3; // Volume modéré
      audioRef.current.play().catch(console.error);
      setIsMusicPlaying(true);
    }
  };

  // Fonction pour arrêter la musique
  const stopMusic = () => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }
  };

  // Fonction pour calculer les dimensions responsive
  const calculateCanvasSize = () => {
    const baseWidth = 1000;
    const baseHeight = 600;
    const aspectRatio = baseWidth / baseHeight;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let newWidth = windowWidth;
    let newHeight = windowHeight;
    
    // Ajuster pour les petits écrans - plein écran sur mobile
    if (windowWidth < 768) {
      // Sur mobile, prendre presque tout l'écran
      newWidth = windowWidth - 20; // Petite marge de 10px de chaque côté
      newHeight = windowHeight - 20; // Petite marge de 10px en haut/bas
      
      // Ajuster pour maintenir l'aspect ratio
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
    
    const newScale = newWidth / baseWidth;
    
    setCanvasSize({ width: newWidth, height: newHeight });
    setScale(newScale);
  };

  // Redimensionnement responsive
  useEffect(() => {
    calculateCanvasSize();
    
    const handleResize = () => {
      calculateCanvasSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Démarrer la musique après la première interaction utilisateur
  useEffect(() => {
    const handleFirstInteraction = () => {
      startMusic();
      // Supprimer les listeners après la première interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    // Ajouter les listeners pour la première interaction
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Init pipes
  useEffect(() => {
    pipes.current = [
      { x: 1000, top: 150, bottom: 300, passed: false },
      { x: 1200, top: 180, bottom: 270, passed: false },
      { x: 1400, top: 160, bottom: 280, passed: false },
      { x: 1600, top: 200, bottom: 250, passed: false },
    ];
    pipesGenerated.current = 4;
  }, []);

  // Fonction commune pour gérer les actions du jeu
  const handleGameAction = () => {
    const now = Date.now();
    
    // Éviter les double sauts (délai minimum de 100ms)
    if (now - lastActionTime.current < 100) {
      return;
    }
    
    // Timer invisible de 2 secondes après game over
    if (isGameOver && now - gameOverTime.current < GAME_OVER_DELAY) {
      return;
    }
    
    lastActionTime.current = now;
    
    if (!isGameStarted && !isGameOver) {
      setIsGameStarted(true);
    } else if (isGameStarted && !isGameOver) {
      velocity.current = jump;
      birdRotation.current = -0.2;
      // Ajouter des particules de saut
      addJumpParticles();
    } else if (isGameOver) {
      restartGame();
    }
  };

  // Keyboard input
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleGameAction();
      }
    };

    window.addEventListener("keydown", handleKey);
    
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [isGameStarted, isGameOver]);

  // Plus besoin d'événements séparés sur le canvas
  // Les événements sont maintenant gérés sur le conteneur principal

  // Fonction pour ajouter des particules de saut
  const addJumpParticles = () => {
    for (let i = 0; i < 8; i++) {
      particles.current.push({
        x: birdX.current,
        y: birdY.current,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 1,
        life: 40,
        maxLife: 40,
        color: Math.random() > 0.5 ? "#ff6b35" : "#4a4a4a"
      });
    }
  };

  // Fonction pour obtenir la vitesse constante du jeu
  const getGameSpeed = () => {
    // S'assurer que la vitesse reste constante
    gameSpeed.current = PIPE_SPEED;
    return PIPE_SPEED;
  };

  // Fonction pour vérifier les collisions (séparée pour plus de clarté)
  const checkCollisions = () => {
        // Collision avec le sol/plafond
        if (birdY.current > 600 - 25 || birdY.current < 25) {
          return true;
        }

    // Collision avec les tuyaux
    for (const pipe of pipes.current) {
      const birdLeft = birdX.current - 12;
      const birdRight = birdX.current + 12;
      const birdTop = birdY.current - 12;
      const birdBottom = birdY.current + 12;
      
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + 60;
      const pipeTopGap = pipe.top;
            const pipeBottomGap = 600 - pipe.bottom;

      if (birdRight > pipeLeft && birdLeft < pipeRight && 
          (birdTop < pipeTopGap || birdBottom > pipeBottomGap)) {
        return true;
      }
    }

    return false;
  };

  // Fonction pour mettre à jour le score de manière sécurisée
  const updateScore = (increment) => {
    if (!isGameOver && isGameStarted) {
      setScore(prevScore => prevScore + increment);
    }
  };

  // Fonction pour générer de nouveaux tuyaux
  const generateNewPipe = () => {
    // Trouver la position du tuyau le plus à droite
    const rightmostPipe = Math.max(...pipes.current.map(pipe => pipe.x));
    const newPipe = {
      x: rightmostPipe + 350, // Espacement normal pour plus de tuyaux
      top: 100 + Math.random() * 200,
      bottom: 100 + Math.random() * 200,
      passed: false
    };
    pipes.current.push(newPipe);
    pipesGenerated.current++;
  };

  // Game loop
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      if (!ctx) return;

      // Effacer le canvas
      ctx.clearRect(0, 0, 1000, 600);

      // Dessiner l'arrière-plan sombre
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, "#1a1a1a");
      gradient.addColorStop(0.5, "#0d0d0d");
      gradient.addColorStop(1, "#000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1000, 600);

      // Dessiner les nuages
      drawClouds(ctx);

      if (isGameStarted && !isGameOver) {
        // 1. Mettre à jour la physique de l'oiseau
        velocity.current += gravity;
        birdY.current += velocity.current;
        birdRotation.current = Math.min(birdRotation.current + 0.015, 0.4);

        // 2. Mettre à jour les tuyaux et le score
        const currentSpeed = getGameSpeed();
        let scoreIncremented = false;
        
        pipes.current.forEach((pipe, i) => {
          pipe.x -= currentSpeed;

          // Tuyau passé - seulement si pas de collision
          if (pipe.x + 60 < birdX.current && !pipe.passed && !isGameOver) {
            pipe.passed = true;
            updateScore(1);
            scoreIncremented = true;
            
            // Ajouter un nouveau tuyau à chaque point
            generateNewPipe();
          }

          // Réinitialiser le tuyau seulement s'il y en a trop
          if (pipe.x < -50 && pipes.current.length > 6) {
            pipes.current.splice(i, 1);
          }
        });

        // 3. Vérifier les collisions APRÈS le mouvement des tuyaux
        const gameEnded = checkCollisions();

        // 4. Si collision détectée, arrêter le jeu immédiatement
        if (gameEnded) {
          setIsGameOver(true);
          gameOverTime.current = Date.now(); // Enregistrer le moment du game over
          if (score > highScore) {
            setHighScore(score);
          }
          velocity.current = 0;
          // Arrêter immédiatement la boucle de jeu
          return;
        }

        // 5. Mettre à jour les particules seulement si pas de collision
        updateParticles(ctx);
        gameTime.current++;

        // 6. Dessiner les éléments
        drawBird(ctx);
        pipes.current.forEach(pipe => drawPipe(ctx, pipe));

      } else if (!isGameStarted) {
        // Écran de démarrage
        drawStartScreen(ctx);
      } else if (isGameOver) {
        // Écran de fin
        drawGameOverScreen(ctx);
      }

      // Continuer la boucle seulement si le jeu n'est pas terminé
      if (isGameStarted && !isGameOver) {
        requestAnimationFrame(gameLoop);
      }
    };

    requestAnimationFrame(gameLoop);
  }, [isGameStarted, isGameOver]);

  // Fonction pour dessiner les nuages
  const drawClouds = (ctx) => {
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < 6; i++) {
      const x = (gameTime.current * 0.1 + i * 300) % 1200;
      const y = 80 + i * 40;
      drawCloud(ctx, x, y);
    }
  };

  // Fonction pour dessiner un nuage
  const drawCloud = (ctx, x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y - 15, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  // Fonction pour dessiner l'oiseau
  const drawBird = (ctx) => {
    ctx.save();
    ctx.translate(birdX.current, birdY.current);
    ctx.rotate(birdRotation.current);

    // Corps de l'oiseau - design joyeux et coloré
    const isHappy = score > 0 && !isGameOver;
    ctx.fillStyle = isHappy ? "#3a3a3a" : "#2a2a2a";
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Aile avec accent coloré
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.ellipse(-6, -6, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Accent coloré sur l'aile - plus vif si heureux
    ctx.fillStyle = isHappy ? "#ff6b35" : "#4a4a4a";
    ctx.beginPath();
    ctx.ellipse(-4, -4, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Œil joyeux et expressif
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(6, -4, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#333333";
    ctx.beginPath();
    ctx.arc(7, -4, 3, 0, Math.PI * 2);
    ctx.fill();

    // Reflet dans l'œil
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(6.5, -4.5, 1, 0, Math.PI * 2);
    ctx.fill();

    // Sourire si heureux
    if (isHappy) {
      ctx.strokeStyle = "#ff6b35";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 2, 8, 0, Math.PI);
      ctx.stroke();
    }

    // Bec coloré - plus vif si heureux
    ctx.fillStyle = isHappy ? "#ff4500" : "#ff6b35";
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(22, -3);
    ctx.lineTo(15, 3);
    ctx.closePath();
    ctx.fill();

    // Petites joues roses si heureux
    if (isHappy) {
      ctx.fillStyle = "#ff69b4";
      ctx.beginPath();
      ctx.arc(-8, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // Fonction pour dessiner un tuyau
  const drawPipe = (ctx, pipe) => {
    // Tuyau du haut - design sombre avec accents colorés
    const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + 60, 0);
    gradient.addColorStop(0, "#1a1a1a");
    gradient.addColorStop(0.5, "#2a2a2a");
    gradient.addColorStop(1, "#0d0d0d");
    ctx.fillStyle = gradient;
    ctx.fillRect(pipe.x, 0, 60, pipe.top);
    ctx.fillRect(pipe.x - 8, pipe.top - 25, 76, 25);

    // Bordure colorée discrète
    ctx.fillStyle = "#4a4a4a";
    ctx.fillRect(pipe.x, 0, 2, pipe.top);
    ctx.fillRect(pipe.x + 58, 0, 2, pipe.top);

    // Tuyau du bas
    ctx.fillStyle = gradient;
    ctx.fillRect(pipe.x, 600 - pipe.bottom, 60, pipe.bottom);
    ctx.fillRect(pipe.x - 8, 600 - pipe.bottom, 76, 25);

    // Bordure colorée discrète
    ctx.fillStyle = "#4a4a4a";
    ctx.fillRect(pipe.x, 600 - pipe.bottom, 2, pipe.bottom);
    ctx.fillRect(pipe.x + 58, 600 - pipe.bottom, 2, pipe.bottom);
  };

  // Fonction pour mettre à jour les particules
  const updateParticles = (ctx) => {
    particles.current = particles.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;

      // Dessiner la particule colorée
      const alpha = particle.life / particle.maxLife;
      const color = particle.color || "#4a4a4a";
      ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      ctx.fill();

      return particle.life > 0;
    });
  };

  // Fonction pour dessiner l'écran de démarrage
  const drawStartScreen = (ctx) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, 1000, 600);


    // Dessiner l'oiseau au centre
    ctx.save();
    ctx.translate(500, 350);
    drawBird(ctx);
    ctx.restore();
  };

  // Fonction pour dessiner l'écran de fin
  const drawGameOverScreen = (ctx) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, 1000, 600);

    ctx.fillStyle = "white";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", 500, 300),
    

    ctx.font = "36px Arial";
    ctx.fillText(`${score}`, 500, 380);

    if (highScore > 0) {
      ctx.font = "24px Arial";
      ctx.fillText(`Meilleur: ${highScore}`, 500, 310);
    }
    
    
  };

  const restartGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsGameStarted(false);
    birdY.current = 300;
    birdX.current = 80;
    velocity.current = 0;
    birdRotation.current = 0;
    gameSpeed.current = PIPE_SPEED; // Vitesse constante
    gameTime.current = 0;
    particles.current = [];
    pipes.current = [
      { x: 1000, top: 150, bottom: 300, passed: false },
      { x: 1200, top: 180, bottom: 270, passed: false },
      { x: 1400, top: 160, bottom: 280, passed: false },
      { x: 1600, top: 200, bottom: 250, passed: false },
    ];
    pipesGenerated.current = 4;
  };

  return (
    <main 
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-2 sm:p-4"
      onTouchStart={(e) => {
        e.preventDefault();
        handleGameAction();
      }}
      onClick={(e) => {
        e.preventDefault();
        handleGameAction();
      }}
    >
      {/* Élément audio pour la musique de fond */}
      <audio
        ref={audioRef}
        preload="auto"
        loop
      >
        <source src="/music/Intro - Reymour.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={1000} 
          height={600} 
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            maxWidth: '100%',
            maxHeight: '100%',
            touchAction: 'none',
            userSelect: 'none'
          }}
          className="border border-gray-800 shadow-2xl bg-black rounded-lg" 
        />
        
        {/* Overlay style page d'accueil */}
        {!isGameStarted && !isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 rounded-lg">
            <div className="text-center max-w-md mx-auto px-4 py-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 tracking-wide">
                PRESS SPACE OR CLICK/TAP TO PLAY
              </h1>
            </div>
          </div>
        )}

        {/* Score responsive en overlay */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-white">
          {isGameStarted && !isGameOver && (
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{score}</div>
          )}
          {highScore > 0 && (
            <div className="text-xs sm:text-sm text-gray-400">Meilleur: {highScore}</div>
          )}
        </div>

        {/* Bouton de contrôle de la musique */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isMusicPlaying) {
                stopMusic();
              } else {
                startMusic();
              }
            }}
            className={`p-2 rounded-full transition-all duration-200 ${
              isMusicPlaying 
                ? "bg-green-600 bg-opacity-70 hover:bg-opacity-90" 
                : "bg-black bg-opacity-50 hover:bg-opacity-70"
            }`}
            aria-label={isMusicPlaying ? "Arrêter la musique" : "Démarrer la musique"}
          >
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
      </div>
    </main>
  );
}
