import React from 'react';
import type { DailyVocab } from '../services/aiService';

interface Props {
  vocab: DailyVocab;
}

export const DailyVocabCard: React.FC<Props> = ({ vocab }) => {
  return (
    <div className="glass-card">
      <div className="vocab-content">
        <div className="vocab-image-container">
          {vocab.imageUrl ? (
            <img 
              src={vocab.imageUrl} 
              alt={`Illustration for ${vocab.word}`} 
              className="vocab-image"
              loading="lazy"
            />
          ) : (
            <div className="skeleton" style={{ width: '100%', height: '100%' }} />
          )}
        </div>
        
        <div className="vocab-details">
          <div className="word-header">
            <h2 className="word">{vocab.word}</h2>
            <span className="part-of-speech">{vocab.partOfSpeech}</span>
          </div>
          
          <p className="definition">
            <strong>Definition:</strong> {vocab.definition}
          </p>
          
          <p className="example">
            "{vocab.exampleSentence}"
          </p>
          
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <strong>Difficulty:</strong> {vocab.difficultyLevel}
            </p>
            {vocab.context && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                <strong>Context:</strong> {vocab.context}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
