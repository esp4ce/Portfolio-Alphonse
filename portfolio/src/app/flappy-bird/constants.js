export const CANVAS_BASE_WIDTH = 1000;
export const CANVAS_BASE_HEIGHT = 600;

export const GRAVITY = 0.4;
export const JUMP_VELOCITY = -6;

export const PIPE_WIDTH = 60;
export const PIPE_SPEED = 2;
export const PIPE_SPACING = 320;
export const SPEED_STEP_SCORE = 3; // palier de score pour accélération
export const SPEED_INCREMENT = 0.5 // accélération par palier
export const MAX_PIPE_SPEED = 6.5; // limite haute de sécurité
export const INITIAL_PIPES = [
  { x: 380, top: 150, bottom: 300, passed: false },
  { x: 700, top: 180, bottom: 270, passed: false },
  { x: 1020, top: 160, bottom: 280, passed: false },
  { x: 1340, top: 200, bottom: 250, passed: false },
];

export const BIRD_INITIAL_X = 80;
export const BIRD_INITIAL_Y = 300;
export const BIRD_RADIUS = 12;

export const GAME_OVER_DELAY_MS = 1000;

export const MOBILE_MIN_DELAY_MS = 200;
export const DESKTOP_MIN_DELAY_MS = 100;


// Réglages du gap (ouverture) et du centrage vertical
export const GAP_MIN = 80;
export const GAP_MAX = 200;
export const CENTER_MIN = 210;
export const CENTER_MAX = 350;


