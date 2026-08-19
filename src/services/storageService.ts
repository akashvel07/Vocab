import type { DailyVocab } from './aiService';
import { supabase } from './supabaseClient';

export interface SavedVocab extends DailyVocab {
  dateStr: string;
}

export async function getSavedHistory(): Promise<SavedVocab[]> {
  try {
    const { data, error } = await supabase
      .from('vocab_history')
      .select('*')
      .order('id', { ascending: false });
      
    if (error) throw error;
    
    return (data || []) as SavedVocab[];
  } catch (error) {
    console.error('Failed to load history from Supabase', error);
    return [];
  }
}

export async function saveVocab(vocab: DailyVocab): Promise<void> {
  try {
    const dateStr = new Date().toISOString().split('T')[0];
    
    // First, check if word exists
    const { data: existing } = await supabase
      .from('vocab_history')
      .select('id')
      .ilike('word', vocab.word)
      .single();
      
    if (!existing) {
      const { error } = await supabase
        .from('vocab_history')
        .insert([{ ...vocab, dateStr }]);
        
      if (error) throw error;
    }
  } catch (error) {
    console.error('Failed to save vocab to Supabase', error);
  }
}
