import { useState, useEffect, useCallback } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { DailyVocabCard } from './components/DailyVocabCard';
import { SettingsModal } from './components/SettingsModal';
import { generateDailyVocab } from './services/aiService';
import type { DailyVocab } from './services/aiService';

function App() {
  const [vocab, setVocab] = useState<DailyVocab | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  const loadVocab = useCallback(async (keyToUse: string) => {
    if (!keyToUse) {
      setIsSettingsOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await generateDailyVocab(keyToUse);
      setVocab(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating vocabulary.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (apiKey && !vocab && !loading && !error) {
      loadVocab(apiKey);
    }
  }, [apiKey, vocab, loading, error, loadVocab]);

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setIsSettingsOpen(false);
    if (!vocab) {
      loadVocab(key);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Daily Vocab</h1>
        <p>Learn a new word every day with AI-generated visual context</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button 
          className="button"
          onClick={() => loadVocab(apiKey)}
          disabled={loading || !apiKey}
        >
          <Sparkles size={18} />
          {loading ? 'Generating...' : 'Generate New Word'}
        </button>
        <button 
          className="button"
          style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings size={18} />
        </button>
      </div>

      {error && (
        <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-card" style={{ height: '400px' }}>
          <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
        </div>
      ) : vocab ? (
        <DailyVocabCard vocab={vocab} />
      ) : (
        !loading && !error && (
          <div className="glass-card" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <p>Please provide your Gemini API key to start learning.</p>
          </div>
        )
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onSave={handleSaveApiKey}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
