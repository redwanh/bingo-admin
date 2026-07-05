import { useState, useEffect, useCallback } from 'react';
import { GAME_STATUS } from '../constants';
import socketService from '../../../services/socketService';

export function useMainBingo(token, user) {
  const [gameState, setGameState] = useState(null);
  const [myCards, setMyCards] = useState([]);
  const [balance, setBalance] = useState(user?.walletBalance ?? 0);
  const [loading, setLoading] = useState(true);
  const [showBuyOptions, setShowBuyOptions] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [lastNumber, setLastNumber] = useState(null);
  const [bingoCallers, setBingoCallers] = useState([]);
  const [cardsPerPage, setCardsPerPage] = useState(() =>
    parseInt(localStorage.getItem('cardsPerPage') || '2')
  );

  // ============================================
  // SOCKET.IO - REPLACES ALL POLLING
  // ============================================
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    console.log('🔌 Connecting socket for main bingo...');
    socketService.connect(token);

    // 🔥 Join room to get initial game state
    socketService.emit('joinRoom', 'main-bingo-room');

    // 📡 Initial state from server (received on join)
    const onGameState = (state) => {
      console.log('📥 Socket gameState:', state?.active ? state.game?.status : 'no game');
      setGameState(state);
      if (state?.myCards) setMyCards(state.myCards);
      if (state?.balance !== undefined) setBalance(state.balance);
      setLoading(false);
    };

    // 📡 Admin created new game setup
    const onSetup = (data) => {
      console.log('📥 mainBingoSetup');
      setGameState({
        active: true,
        game: data.game,
        config: data.config,
        rule: data.rule,
        myCards: [],
        balance: balance
      });
      setLastNumber(null);
      setBingoCallers([]);
      setCountdown(null);
    };

    // 📡 Countdown started (30s before game)
    const onCountdown = (data) => {
      console.log('📥 Countdown:', data.seconds);
      setCountdown(data.seconds);
      setGameState(prev => prev ? {
        ...prev,
        game: { ...prev.game, status: 'countdown' }
      } : null);
    };

    // 📡 Game is now live
    const onStarted = (data) => {
      console.log('📥 Game started!');
      setCountdown(null);
      setGameState(prev => prev ? {
        ...prev,
        game: { ...data.game, status: 'in_progress' }
      } : null);
    };

    // 📡 New number drawn
    const onNumberDrawn = (data) => {
      setLastNumber({ number: data.number, letter: data.letter });
      setGameState(prev => {
        if (!prev?.game) return prev;
        return {
          ...prev,
          game: {
            ...prev.game,
            currentNumber: { number: data.number, letter: data.letter },
            drawnNumbers: [...(prev.game.drawnNumbers || []), data]
          }
        };
      });
    };

    // 📡 Prize amount set by admin
    const onPrizeSet = (data) => {
      console.log('📥 Prize set:', data.prizeAmount);
      setGameState(prev => prev ? {
        ...prev,
        game: { ...prev.game, prizeAmount: data.prizeAmount }
      } : null);
    };

    // 📡 First player called BINGO
    const onFirstBingo = (data) => {
      console.log('📥 First BINGO!');
      setBingoCallers(prev => [...prev, data]);
      setGameState(prev => prev ? {
        ...prev,
        game: { ...prev.game, status: 'bingo_called' }
      } : null);
    };

    // 📡 Additional BINGO during grace period
    const onAdditionalBingo = (data) => {
      console.log('📥 Additional BINGO');
      setBingoCallers(prev => [...prev, data]);
    };

    // 📡 Grace period started
    const onGracePeriod = (data) => {
      console.log('📥 Grace period:', data.seconds);
      setGameState(prev => prev ? {
        ...prev,
        game: {
          ...prev.game,
          status: 'grace_period',
          gracePeriodEndTime: data.endTime
        }
      } : null);
    };

    // 📡 Game ended
    const onGameEnded = (data) => {
      console.log('📥 Game ended, winners:', data.winners?.length);
      setGameState(prev => prev ? {
        ...prev,
        active: false,
        game: { ...prev.game, status: 'completed' },
        winners: data.winners
      } : null);
      setBingoCallers([]);
      setLastNumber(null);
      setCountdown(null);
    };

    // 📡 False BINGO (cheater blocked)
    const onFalseBingo = (data) => {
      console.log('❌ False BINGO:', data.reason);
    };

    // 📡 Cards updated (after purchase, etc.)
    const onCardsUpdated = (data) => {
      setMyCards(data.cards);
    };

    // 📡 Card registered (purchased successfully)
    const onCardRegistered = (data) => {
      if (data.status === 'ok') {
        setMyCards(prev => prev.map(c =>
          c._id === data.cardId ? { ...c, status: 'registered' } : c
        ));
        if (data.newBalance !== undefined) setBalance(data.newBalance);
      }
    };

    // 📡 Card purchase error
    const onCardPurchaseError = (data) => {
      console.error('❌ Card purchase error:', data.message);
      alert(data.message);
    };

    // 📡 Connection error
    const onConnectError = (err) => {
      console.error('❌ Socket error:', err.message);
      setLoading(false);
    };

    // 📡 Disconnected
    const onDisconnect = (reason) => {
      console.log('🔴 Socket disconnected:', reason);
    };

    // Register all listeners with CORRECT server event names
    socketService.on('gameState', onGameState);
    socketService.on('mainBingoSetup', onSetup);
    socketService.on('mainBingoCountdown', onCountdown);
    socketService.on('mainBingoStarted', onStarted);
    socketService.on('mainBingoNumberDrawn', onNumberDrawn);
    socketService.on('mainBingoPrizeSet', onPrizeSet);
    socketService.on('mainBingoFirstBingo', onFirstBingo);
    socketService.on('mainBingoAdditionalBingo', onAdditionalBingo);
    socketService.on('mainBingoGracePeriod', onGracePeriod);
    socketService.on('mainBingoEnded', onGameEnded);
    socketService.on('mainBingoFalseBingo', onFalseBingo);
    socketService.on('cardsUpdated', onCardsUpdated);
    socketService.on('cardRegistered', onCardRegistered);
    socketService.on('cardPurchaseError', onCardPurchaseError);
    socketService.on('connect_error', onConnectError);
    socketService.on('disconnect', onDisconnect);

    // Cleanup on unmount
    return () => {
      console.log('🔌 Cleaning up main bingo socket listeners');
      socketService.off('gameState', onGameState);
      socketService.off('mainBingoSetup', onSetup);
      socketService.off('mainBingoCountdown', onCountdown);
      socketService.off('mainBingoStarted', onStarted);
      socketService.off('mainBingoNumberDrawn', onNumberDrawn);
      socketService.off('mainBingoPrizeSet', onPrizeSet);
      socketService.off('mainBingoFirstBingo', onFirstBingo);
      socketService.off('mainBingoAdditionalBingo', onAdditionalBingo);
      socketService.off('mainBingoGracePeriod', onGracePeriod);
      socketService.off('mainBingoEnded', onGameEnded);
      socketService.off('mainBingoFalseBingo', onFalseBingo);
      socketService.off('cardsUpdated', onCardsUpdated);
      socketService.off('cardRegistered', onCardRegistered);
      socketService.off('cardPurchaseError', onCardPurchaseError);
      socketService.off('connect_error', onConnectError);
      socketService.off('disconnect', onDisconnect);

      socketService.emit('leaveRoom', 'main-bingo-room');
    };
  }, [token]);

  // ============================================
  // CARD PURCHASE
  // ============================================
  const buyCards = useCallback((qty) => {
    setShowBuyOptions(false);
    // Use socket to register cards
    // You'll need to adjust this based on your actual card purchase flow
    console.log('Buy', qty, 'cards');
    // socketService.emit('registerCard', { roomId: 'main-bingo-room', quantity: qty });
  }, []);

  // ============================================
  // CARDS PER PAGE
  // ============================================
  const handleCardsPerPageChange = useCallback((num) => {
    setCardsPerPage(num);
    localStorage.setItem('cardsPerPage', String(num));
  }, []);

  // ============================================
  // DERIVED STATE
  // ============================================
  const isWaiting = gameState?.active &&
    (gameState.game?.status === 'setup' ||
     gameState.game?.status === 'countdown');

  const isLive = gameState?.active &&
    (gameState.game?.status === 'in_progress' ||
     gameState.game?.status === 'bingo_called' ||
     gameState.game?.status === 'grace_period');

  return {
    gameState,
    myCards,
    balance,
    loading,
    showBuyOptions,
    cardsPerPage,
    isWaiting,
    isLive,
    countdown,
    lastNumber,
    bingoCallers,
    setShowBuyOptions,
    buyCards,
    handleCardsPerPageChange,
  };
}