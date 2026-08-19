import React, { useState, useEffect } from 'react';

const WORDS = ['LEARN', 'VOCAB', 'SMART', 'BRAIN', 'WORDS', 'STUDY', 'FOCUS'];

export const MiniGameLoader: React.FC = () => {
  const [targetWord, setTargetWord] = useState('');
  const [jumbled, setJumbled] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(word);
    
    // Simple jumble
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setJumbled(arr);
  }, []);

  const handleSelect = (index: number) => {
    if (selected.includes(index)) return;
    
    const newSelected = [...selected, index];
    setSelected(newSelected);
    
    if (newSelected.length === targetWord.length) {
      const guessedWord = newSelected.map(i => jumbled[i]).join('');
      if (guessedWord === targetWord) {
        setWon(true);
      } else {
        // Shake and reset
        setTimeout(() => setSelected([]), 500);
      }
    }
  };

  const handleDeselect = (idxInSelected: number) => {
    const newSelected = [...selected];
    newSelected.splice(idxInSelected, 1);
    setSelected(newSelected);
  };

  return (
    <div className="glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Generating AI Image...</h3>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Play a quick word jumble while you wait!</p>
      
      {won ? (
        <div style={{ color: '#4ade80', fontSize: '1.5rem', fontWeight: 'bold' }}>You Got It! 🎉</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          {/* Answer slots */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {targetWord.split('').map((_, i) => {
              const selectedIdx = selected[i];
              return (
                <div 
                  key={i} 
                  onClick={() => selectedIdx !== undefined && handleDeselect(i)}
                  style={{
                    width: '3rem', height: '3rem', 
                    borderBottom: '3px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 'bold',
                    cursor: selectedIdx !== undefined ? 'pointer' : 'default',
                    color: '#fff'
                  }}
                >
                  {selectedIdx !== undefined ? jumbled[selectedIdx] : ''}
                </div>
              );
            })}
          </div>

          {/* Jumbled letters */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {jumbled.map((letter, i) => {
              const isUsed = selected.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isUsed}
                  style={{
                    width: '3rem', height: '3rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isUsed ? 'rgba(255,255,255,0.05)' : 'var(--accent-color)',
                    color: isUsed ? 'transparent' : '#fff',
                    fontSize: '1.5rem', fontWeight: 'bold',
                    cursor: isUsed ? 'default' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
