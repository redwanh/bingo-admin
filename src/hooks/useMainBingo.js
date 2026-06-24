import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API, GAME_STATUS } from '../constants';
import socketService from '../../../services/socketService';  // NEW IMPORT

export function useMainBingo(token, user) {
  const [gameState, setGameState] = useState(null);
  const [myCards, setMyCards] = useState([]);
  const [balance, setBalance] = useState(user?.walletBalance ?? 0);
  const [loading, setLoading] = useState(true);
  const [showBuyOptions, setShowBuyOptions] = useState(false);
  const [countdown, setCountdown] = useState(null);  // NEW: countdown seconds
  const [lastNumber, setLastNumber] = useState(null);  // NEW: last drawn number
  const [bingoCallers, setBingoCallers] = useState([]);  // NEW: who called bingo
  const [cardsPerPage, setCardsPerPage] = useState(() =>
    parseInt(localStorage.getItem('cardsPerPage') || '2')
  );

  const headers = { Authorization: 'Bearer ' + token };

  // ============================================
  // SOCKET.IO LISTENERS
  // ============================================
  useEffect(() => {
    if (!token) return;
    
    socketService.connect(token);

    // Admin started game → show countdown
    const onGameStarted = (data) => {
      setGameState(prev => ({
        ...prev,
        active: true,
        game: { ...prev?.game, status: 'countdown' },
        config: { 
          ...prev?.config,
          ruleName: data.ruleName,
          cardPrice: data.cardPrice,
          prizeAmount: 'TBD'  // Prize not set yet
        }
      }));
      setCountdown(data.countdownSeconds || 30);
    };

    // Countdown update
    const onCountdown = (data) => {
      setCountdown(data.seconds);
    };

    // Game is live
    const onGameLive = (data) => {
      setGameState(prev => ({
        ...prev,
        game: { ...prev?.game, status: 'in_progress' }
      }));
      setCountdown(null);
    };

    // New number drawn
    const onNumberDrawn = (data) => {
      setLastNumber(data.number);
      setGameState(prev => ({
        ...prev,
        game: {
          ...prev?.game,
          drawnNumbers: [...(prev?.game?.drawnNumbers || []), data.number]
        }
      }));
    };

    // Prize updated
    const onPrizeUpdated = (data) => {
      setGameState(prev => ({
        ...prev,
        config: { ...prev?.config, prizeAmount: data.prizeAmount }
      }));
    };

    // First BINGO
    const onFirstBingo = (data) => {
      setBingoCallers(prev => [...prev, data]);
      setGameState(prev => ({
        ...prev,
        game: { ...prev?.game, status: 'bingo_called' }
      }));
    };

    // Game ended
    const onGameEnded = (data) => {
      setGameState(prev => ({ ...prev, active: false }));
      setBingoCallers([]);
      setLastNumber(null);
    };

    // Register all listeners
    socketService.on('gameStarted', onGameStarted);
    socketService.on('countdown', onCountdown);
    socketService.on('gameLive', onGameLive);
    socketService.on('numberDrawn', onNumberDrawn);
    socketService.on('prizeUpdated', onPrizeUpdated);
    socketService.on('firstBingo', onFirstBingo);
    socketService.on('gameEnded', onGameEnded);

    return () => {
      socketService.off('gameStarted', onGameStarted);
      socketService.off('countdown', onCountdown);
      socketService.off('gameLive', onGameLive);
      socketService.off('numberDrawn', onNumberDrawn);
      socketService.off('prizeUpdated', onPrizeUpdated);
      socketService.off('firstBingo', onFirstBingo);
      socketService.off('gameEnded', onGameEnded);
    };
  }, [token]);

  // ============================================
  // POLLING (Fallback)
  // ============================================
  const fetchState = useCallback(async () => {
    try {
      const res = await axios.get(API + '/api/main-bingo/state', { headers });
      setGameState(prev => {
        // Don't overwrite if we got socket data
        if (prev?.active && res.data.active) {
          return { ...prev, ...res.data };
        }
        return res.data.active ? res.data : prev;
      });
      
      const serverCards = res.data.myCards;
      if (serverCards?.length > 0) {
        setMyCards(prev => {
          if (prev.length === 0) return serverCards;
          const prevIds = new Set(prev.map(c => c._id));
          const newCards = serverCards.filter(c => !prevIds.has(c._id));
          return newCards.length > 0 ? [...prev, ...newCards] : prev;
        });
      }
      
      setBalance(res.data.balance ?? balance);
    } catch (e) {
      // Silent fail
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, [fetchState]);

  // ... rest of existing code (buyCards, handleCardsPerPageChange, isWaiting, isLive, etc.)

  const isWaiting = gameState?.active && 
    (gameState.game?.status === GAME_STATUS.SETUP || 
     gameState.game?.status === GAME_STATUS.COUNTDOWN);

  const isLive = gameState?.active && 
    (gameState.game?.status === GAME_STATUS.IN_PROGRESS || 
     gameState.game?.status === GAME_STATUS.BINGO_CALLED);

  return {
    gameState,
    myCards,
    balance,
    loading,
    showBuyOptions,
    cardsPerPage,
    isWaiting,
    isLive,
    countdown,        // NEW
    lastNumber,       // NEW
    bingoCallers,     // NEW
    setShowBuyOptions,
    buyCards,
    handleCardsPerPageChange,
    fetchState
  };
}