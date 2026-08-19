import { useState, useEffect, useCallback } from 'react';
import { Sparkles, BookOpen, Clock, Gamepad2 } from 'lucide-react';
import { DailyVocabCard } from './components/DailyVocabCard';
import { HistoryView } from './components/HistoryView';
import { QuickTestView } from './components/QuickTestView';
import { MiniGameLoader } from './components/MiniGameLoader';
import { generateDailyVocab } from './services/aiService';
import { saveVocab } from './services/storageService';
import type { DailyVocab } from './services/aiService';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

type Tab = 'daily' | 'history' | 'test';

function App() {
  const [vocab, setVocab] = useState<DailyVocab | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('daily');

  const loadVocab = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateDailyVocab(API_KEY);
      setVocab(data);
      saveVocab(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating vocabulary.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!vocab && !loading && !error && activeTab === 'daily') {
      loadVocab();
    }
  }, [vocab, loading, error, loadVocab, activeTab]);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Daily Vocab</h1>
        <p>Learn a new word every day with AI-generated visual context</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '12px' }}>
        <button 
          className={`button ${activeTab === 'daily' ? 'active' : ''}`}
          style={{ background: activeTab === 'daily' ? 'var(--accent-color)' : 'transparent', border: 'none' }}
          onClick={() => setActiveTab('daily')}
        >
          <BookOpen size={18} /> Daily Word
        </button>
        <button 
          className={`button ${activeTab === 'history' ? 'active' : ''}`}
          style={{ background: activeTab === 'history' ? 'var(--accent-color)' : 'transparent', border: 'none' }}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={18} /> History
        </button>
        <button 
          className={`button ${activeTab === 'test' ? 'active' : ''}`}
          style={{ background: activeTab === 'test' ? 'var(--accent-color)' : 'transparent', border: 'none' }}
          onClick={() => setActiveTab('test')}
        >
          <Gamepad2 size={18} /> Quick Test
        </button>
      </div>

      {activeTab === 'daily' && (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              className="button"
              onClick={loadVocab}
              disabled={loading}
            >
              <Sparkles size={18} />
              {loading ? 'Generating...' : 'Generate New Word'}
            </button>
          </div>

          {error && (
            <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '1rem', wordWrap: 'break-word' }}>
              {error}
            </div>
          )}

          {loading ? (
            <MiniGameLoader />
          ) : vocab ? (
            <DailyVocabCard vocab={vocab} />
          ) : null}
        </>
      )}

      {activeTab === 'history' && <HistoryView />}
      
      {activeTab === 'test' && <QuickTestView />}
      
    </div>
  );
}

export default App;
