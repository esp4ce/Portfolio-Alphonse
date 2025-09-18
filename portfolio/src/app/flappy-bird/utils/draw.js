import { CANVAS_BASE_HEIGHT, CANVAS_BASE_WIDTH, PIPE_WIDTH, BIRD_RADIUS } from "../constants";

export const createBackgroundGradient = (ctx) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_BASE_HEIGHT);
  gradient.addColorStop(0, "#1a1a1a");
  gradient.addColorStop(0.5, "#0d0d0d");
  gradient.addColorStop(1, "#000000");
  return gradient;
};

export const clearAndFillBackground = (ctx) => {
  ctx.clearRect(0, 0, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT);
  const gradient = createBackgroundGradient(ctx);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT);
};

export const drawCloud = (ctx, x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
  ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
  ctx.arc(x + 25, y - 15, 20, 0, Math.PI * 2);
  ctx.fill();
};

export const drawClouds = (ctx, gameTime) => {
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  for (let i = 0; i < 6; i++) {
    const x = (gameTime * 0.1 + i * 300) % 1200;
    const y = 80 + i * 40;
    drawCloud(ctx, x, y);
  }
};

export const drawBird = (ctx, birdX, birdY, birdRotation, score, isGameOver) => {
  ctx.save();
  ctx.translate(birdX, birdY);
  ctx.rotate(birdRotation);

  // Corps de l'oiseau - noir constant
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.ellipse(-6, -6, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#4a4a4a";
  ctx.beginPath();
  ctx.ellipse(-4, -4, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(6, -4, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#333333";
  ctx.beginPath();
  ctx.arc(7, -4, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(6.5, -4.5, 1, 0, Math.PI * 2);
  ctx.fill();

  // Bec fixe
  ctx.fillStyle = "#ff6b35";
  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(22, -3);
  ctx.lineTo(15, 3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
};

export const drawPipe = (ctx, pipe) => {
  const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
  gradient.addColorStop(0, "#1a1a1a");
  gradient.addColorStop(0.5, "#2a2a2a");
  gradient.addColorStop(1, "#0d0d0d");
  ctx.fillStyle = gradient;
  ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
  ctx.fillRect(pipe.x - 8, pipe.top - 25, PIPE_WIDTH + 16, 25);

  ctx.fillStyle = "#4a4a4a";
  ctx.fillRect(pipe.x, 0, 2, pipe.top);
  ctx.fillRect(pipe.x + PIPE_WIDTH - 2, 0, 2, pipe.top);

  ctx.fillStyle = gradient;
  ctx.fillRect(pipe.x, CANVAS_BASE_HEIGHT - pipe.bottom, PIPE_WIDTH, pipe.bottom);
  ctx.fillRect(pipe.x - 8, CANVAS_BASE_HEIGHT - pipe.bottom, PIPE_WIDTH + 16, 25);

  ctx.fillStyle = "#4a4a4a";
  ctx.fillRect(pipe.x, CANVAS_BASE_HEIGHT - pipe.bottom, 2, pipe.bottom);
  ctx.fillRect(pipe.x + PIPE_WIDTH - 2, CANVAS_BASE_HEIGHT - pipe.bottom, 2, pipe.bottom);
};

export const drawStartScreen = (ctx, drawBirdFn) => {
  ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
  ctx.fillRect(0, 0, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT);
  ctx.save();
  ctx.translate(CANVAS_BASE_WIDTH / 2, CANVAS_BASE_HEIGHT / 2 + 50);
  drawBirdFn(ctx);
  ctx.restore();
};

export const drawParticles = (ctx, particles) => {
  particles.forEach((particle) => {
    const alpha = particle.life / particle.maxLife;
    const color = particle.color || "#4a4a4a";
    ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
};


