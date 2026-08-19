import React, { useState, useEffect } from 'react';
import { getSavedHistory } from '../services/storageService';
import type { SavedVocab } from '../services/storageService';

export const QuickTestView: React.FC = () => {
  const [history, setHistory] = useState<SavedVocab[]>([]);
  const [currentTest, setCurrentTest] = useState<SavedVocab | null>(null);
  const [guess, setGuess] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

  useEffect(() => {
    async function loadHistory() {
      const data = await getSavedHistory();
      setHistory(data);
      if (data.length > 0) {
        pickRandomTest(data);
      }
    }
    loadHistory();
  }, []);

  const pickRandomTest = (data: SavedVocab[]) => {
    const randomIdx = Math.floor(Math.random() * data.length);
    setCurrentTest(data[randomIdx]);
    setGuess('');
    setShowHint(false);
    setFeedback('none');
  };

  const getHintString = (word: string) => {
    if (word.length <= 2) return word.charAt(0) + '_';
    return word.charAt(0) + ' _ '.repeat(word.length - 2) + word.charAt(word.length - 1);
  };

  const checkGuess = () => {
    if (!currentTest) return;
    if (guess.toLowerCase().trim() === currentTest.word.toLowerCase()) {
      setFeedback('correct');
      setTimeout(() => pickRandomTest(history), 2000); // Next question after 2s
    } else {
      setFeedback('incorrect');
    }
  };

  if (history.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', margin: '2rem auto' }}>
        <h2>No Vocabulary to Test</h2>
        <p style={{ color: 'var(--text-muted)' }}>Generate some words first before taking a test!</p>
      </div>
    );
  }

  if (!currentTest) return null;

  return (
    <div className="glass-card" style={{ margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '2rem' }}>Quick Test</h2>
      
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <p style={{ fontStyle: 'italic', color: 'var(--accent-color)', marginBottom: '1rem' }}>{currentTest.partOfSpeech}</p>
        <p style={{ fontSize: '1.25rem', lineHeight: '1.6' }}>{currentTest.definition}</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        {showHint ? (
          <p style={{ fontSize: '1.5rem', letterSpacing: '0.2rem', fontFamily: 'monospace' }}>
            {getHintString(currentTest.word)}
          </p>
        ) : (
          <button 
            className="button" 
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
            onClick={() => setShowHint(true)}
          >
            Reveal Hint
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <input 
          type="text"
          value={guess}
          onChange={e => setGuess(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && checkGuess()}
          placeholder="Type your guess..."
          style={{
            padding: '1rem',
            borderRadius: '8px',
            border: '2px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.3)',
            color: 'white',
            fontSize: '1.2rem',
            width: '100%',
            maxWidth: '300px',
            outline: 'none'
          }}
        />
        <button className="button" onClick={checkGuess}>Submit</button>
      </div>

      {feedback === 'correct' && (
        <div style={{ marginTop: '1.5rem', color: '#4ade80', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Correct! Loading next word...
        </div>
      )}
      {feedback === 'incorrect' && (
        <div style={{ marginTop: '1.5rem', color: '#ef4444', fontSize: '1.2rem' }}>
          Incorrect, try again!
        </div>
      )}
    </div>
  );
};
