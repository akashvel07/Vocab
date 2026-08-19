import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onSave: (apiKey: string) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onSave, onClose }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Settings</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Please enter your Google Gemini API key to generate daily vocabulary.
        </p>
        
        <input
          type="password"
          className="input"
          placeholder="AIzaSy..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button 
            className="button" 
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="button"
            onClick={() => onSave(apiKey)}
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};
