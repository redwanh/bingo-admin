export const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const COLS = ['B', 'I', 'N', 'G', 'O'];

export const COLORS = {
  B: '#FF4757', I: '#FFA502', N: '#2ED573',
  G: '#FF6348', O: '#7C5CFC'
};

export const RANGES = {
  B: [1, 15], I: [16, 30], N: [31, 45],
  G: [46, 60], O: [61, 75]
};

export const GAME_STATUS = {
  SETUP: 'setup',
  COUNTDOWN: 'countdown',
  IN_PROGRESS: 'in_progress',
  BINGO_CALLED: 'bingo_called',
  COMPLETED: 'completed'
};
