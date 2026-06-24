import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API, GAME_STATUS } from '../constants';

export function useMainBingo(token, user) {
  const [gameState, setGameState] = useState(null);
  const [myCards, setMyCards] = useState([]);
  const [balance, setBalance] = useState(user?.walletBalance ?? 0);
  const [loading, setLoading] = useState(true);
  const [showBuyOptions, setShowBuyOptions] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(() =>
    parseInt(localStorage.getItem('cardsPerPage') || '2')
  );

  const headers = { Authorization: 'Bearer ' + token };

  const fetchState = useCallback(async () => {
    try {
      const res = await axios.get(API + '/api/main-bingo/state', { headers });
      setGameState(res.data);
      
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
      // Silent fail - game might not be active
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, [fetchState]);

  const buyCards = useCallback((qty) => {
    setShowBuyOptions(false);
    // TODO: Implement actual card purchase
    console.log('Buy', qty, 'cards');
  }, []);

  const handleCardsPerPageChange = useCallback((num) => {
    setCardsPerPage(num);
    localStorage.setItem('cardsPerPage', String(num));
  }, []);

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
    setShowBuyOptions,
    buyCards,
    handleCardsPerPageChange,
    fetchState
  };
}
