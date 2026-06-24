import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  // Connect with auth token
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
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket error:', error.message);
    });

    // Listen for game events
    this.setupGameListeners();
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // ============================================
  // GAME EVENT LISTENERS
  // ============================================
  setupGameListeners() {
    // Admin started a new game
    this.socket.on('mainBingoGameStarted', (data) => {
      console.log('📡 New game starting:', data);
      this.notifyListeners('gameStarted', data);
    });

    // Game countdown started
    this.socket.on('mainBingoCountdown', (data) => {
      console.log('⏳ Countdown:', data);
      this.notifyListeners('countdown', data);
    });

    // Game is now live (drawing numbers)
    this.socket.on('mainBingoLive', (data) => {
      console.log('🎮 Game is live:', data);
      this.notifyListeners('gameLive', data);
    });

    // New number drawn
    this.socket.on('mainBingoNumberDrawn', (data) => {
      this.notifyListeners('numberDrawn', data);
    });

    // Someone called BINGO
    this.socket.on('mainBingoFirstBingo', (data) => {
      console.log('🎉 First BINGO:', data);
      this.notifyListeners('firstBingo', data);
    });

    this.socket.on('mainBingoAdditionalBingo', (data) => {
      console.log('🎉 Additional BINGO:', data);
      this.notifyListeners('additionalBingo', data);
    });

    // Game ended
    this.socket.on('mainBingoGameEnded', (data) => {
      console.log('🏁 Game ended:', data);
      this.notifyListeners('gameEnded', data);
    });

    // Prize updated
    this.socket.on('mainBingoPrizeUpdated', (data) => {
      console.log('💰 Prize updated:', data);
      this.notifyListeners('prizeUpdated', data);
    });

    // Grace period
    this.socket.on('mainBingoGracePeriod', (data) => {
      this.notifyListeners('gracePeriod', data);
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

// Singleton instance
const socketService = new SocketService();
export default socketService;
