import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import ScheduledGamesView from '../../../components/bingo/ScheduledGamesView';

export default function NoActiveGame({ token }) {
  const { t } = useLanguage();

  return (
    <div style={S.page}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, width: '100%' }}>
        <ScheduledGamesView token={token} />
      </div>
    </div>
  );
}

const S = {
  page: {
    height: '100vh', height: '100dvh',
    overflow: 'auto', background: '#F5F5F5',
    fontFamily: "'Outfit', sans-serif",
  }
};
