import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected:', this.socket.id);
      // Join main bingo room
      this.emit('joinRoom', 'main-bingo-room');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket error:', error.message);
    });

    // Listen for ALL game events with CORRECT names
    this.setupGameListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // ============================================
  // GAME EVENT LISTENERS (CORRECTED NAMES)
  // ============================================
  setupGameListeners() {
    // Initial state on join
    this.socket.on('gameState', (data) => {
      console.log('📡 gameState:', data?.active ? data.game?.status : 'no game');
      this.notifyListeners('gameState', data);
    });

    // Admin created new game
    this.socket.on('mainBingoSetup', (data) => {
      console.log('📡 New game setup:', data);
      this.notifyListeners('gameSetup', data);
    });

    // Countdown started
    this.socket.on('mainBingoCountdown', (data) => {
      console.log('⏳ Countdown:', data);
      this.notifyListeners('countdown', data);
    });

    // Game is live
    this.socket.on('mainBingoStarted', (data) => {
      console.log('🎮 Game started:', data);
      this.notifyListeners('gameStarted', data);
    });

    // Number drawn
    this.socket.on('mainBingoNumberDrawn', (data) => {
      this.notifyListeners('numberDrawn', data);
    });

    // Prize set
    this.socket.on('mainBingoPrizeSet', (data) => {
      console.log('💰 Prize set:', data);
      this.notifyListeners('prizeUpdated', data);
    });

    // First BINGO
    this.socket.on('mainBingoFirstBingo', (data) => {
      console.log('🎉 First BINGO:', data);
      this.notifyListeners('firstBingo', data);
    });

    // Additional BINGO
    this.socket.on('mainBingoAdditionalBingo', (data) => {
      console.log('🎉 Additional BINGO:', data);
      this.notifyListeners('additionalBingo', data);
    });

    // Grace period
    this.socket.on('mainBingoGracePeriod', (data) => {
      this.notifyListeners('gracePeriod', data);
    });

    // Game ended
    this.socket.on('mainBingoEnded', (data) => {
      console.log('🏁 Game ended:', data);
      this.notifyListeners('gameEnded', data);
    });

    // False BINGO
    this.socket.on('mainBingoFalseBingo', (data) => {
      this.notifyListeners('falseBingo', data);
    });

    // Cards updated
    this.socket.on('cardsUpdated', (data) => {
      this.notifyListeners('cardsUpdated', data);
    });
  }

  // ============================================
  // LISTENER MANAGEMENT
  // ============================================
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }
}

const socketService = new SocketService();
export default socketService;