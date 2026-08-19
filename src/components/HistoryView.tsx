import React, { useEffect, useState } from 'react';
import { getSavedHistory } from '../services/storageService';
import type { SavedVocab } from '../services/storageService';

export const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<SavedVocab[]>([]);

  useEffect(() => {
    async function loadHistory() {
      const data = await getSavedHistory();
      setHistory(data);
    }
    loadHistory();
  }, []);

  if (history.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', margin: '2rem auto' }}>
        <h2>No History Yet</h2>
        <p style={{ color: 'var(--text-muted)' }}>Generate some vocabulary words to see them here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {history.map((item, idx) => (
        <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{item.word}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              {item.dateStr}
            </span>
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>{item.partOfSpeech}</span>
          <p style={{ fontSize: '1rem', color: '#e2e8f0', flex: 1 }}>{item.definition}</p>
          <div style={{ height: '150px', borderRadius: '8px', overflow: 'hidden', marginTop: '1rem' }}>
            <img src={item.imageUrl} alt={item.word} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>
        </div>
      ))}
    </div>
  );
};
