import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import GameStatusBar from '../../../components/bingo/GameStatusBar';
import { useMainBingo } from './hooks/useMainBingo';
import NoActiveGame from './components/NoActiveGame';
import WaitingState from './components/WaitingState';
import LiveGame from './components/LiveGame';
import GameCards from './components/GameCards';
import BuyOptions from './components/BuyOptions';

export default function MainBingo({ token, user }) {
  const { t } = useLanguage();
  const { roomId } = useParams();
  const {
    gameState, myCards, loading,
    showBuyOptions, cardsPerPage,
    isWaiting, isLive,
    setShowBuyOptions, buyCards,
    handleCardsPerPageChange
  } = useMainBingo(token, user);

  // LOADING
  if (loading) {
    return (
      <div style={S.page}>
        <div style={S.center}>
          <p style={S.emoji}>??</p>
          <p style={S.title}>{t('connecting', 'Connecting...')}</p>
        </div>
      </div>
    );
  }

  // NO ACTIVE GAME
  if (!gameState?.active) {
    return <NoActiveGame token={token} />;
  }

  // ACTIVE GAME
  return (
    <div style={S.page}>
      <GameStatusBar
        gameState={gameState}
        myCards={myCards}
        isLive={isLive}
        isWaiting={isWaiting}
        cardsPerPage={cardsPerPage}
        onCardsPerPageChange={handleCardsPerPageChange}
      />

      {isLive ? <LiveGame gameState={gameState} /> : <WaitingState gameState={gameState} />}

      <GameCards cardsPerPage={cardsPerPage} />

      {isWaiting && (
        <BuyOptions
          cardPrice={gameState?.config?.cardPrice}
          onBuy={buyCards}
          onToggle={() => setShowBuyOptions(!showBuyOptions)}
          showOptions={showBuyOptions}
        />
      )}
    </div>
  );
}

const S = {
  page: {
    height: '100vh', height: '100dvh',
    display: 'flex', flexDirection: 'column',
    background: '#F5F5F5', overflow: 'hidden',
    fontFamily: "'Outfit', sans-serif",
    WebkitUserSelect: 'none', userSelect: 'none',
    position: 'relative',
  },
  center: {
    flex: 1, display: 'flex', justifyContent: 'center',
    alignItems: 'center', flexDirection: 'column', gap: 16
  },
  emoji: { fontSize: 56, margin: 0 },
  title: { fontSize: 24, fontWeight: 800, color: '#333', margin: 0 },
};

