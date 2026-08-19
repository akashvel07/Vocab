import { GoogleGenerativeAI } from '@google/generative-ai';

export interface DailyVocab {
  word: string;
  definition: string;
  partOfSpeech: string;
  exampleSentence: string;
  difficultyLevel: string;
  context: string;
  imageUrl: string;
}

const IMAGE_PROMPT_TEMPLATE = `You are the visual-generation engine for a modern daily vocabulary learning web app.
Your job is to create one high-quality educational illustration that makes the meaning of a vocabulary word easy to understand visually.

Vocabulary Input
Word: {{WORD}}
Definition: {{DEFINITION}}
Part of Speech: {{PART_OF_SPEECH}}
Example Sentence: {{EXAMPLE_SENTENCE}}
Difficulty Level: {{DIFFICULTY_LEVEL}}
Optional Context: {{CONTEXT}}

Your Objective
Create an engaging, context-rich image that visually communicates the meaning of {{WORD}}.
The image should help a language learner understand and remember the word without relying entirely on written text.
Do not simply create an image of an object associated with the word. Instead, communicate the concept, action, emotion, situation, or relationship represented by the word.

Visual Style
Create a polished, modern educational illustration suitable for a premium language-learning application.
Use clean contemporary illustration, friendly and approachable visual language, rich but harmonious colors, soft natural lighting.
Avoid making the image childish unless the vocabulary is specifically intended for young children.

Text Restrictions
Do NOT place the vocabulary word, definition, example sentence, labels, captions, speech bubbles, UI elements, logos, watermarks, or explanatory text inside the generated image.

Provide a highly detailed, descriptive image generation prompt (max 500 characters) that strictly follows these guidelines. Return ONLY the prompt text, without quotes or extra explanation.`;

export async function generateDailyVocab(apiKey: string): Promise<DailyVocab> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

  const textPrompt = `Generate a useful, interesting daily vocabulary word for a language learner. 
  It should not be too basic, but not overly obscure (e.g., words like 'ephemeral', 'serene', 'cacophony', 'ubiquitous').
  Respond strictly in JSON format with the following keys:
  - word
  - definition
  - partOfSpeech
  - exampleSentence
  - difficultyLevel (e.g., Intermediate, Advanced)
  - context (a brief fun fact or etymology)`;

  try {
    const result = await model.generateContent(textPrompt);
    const response = result.response;
    let text = response.text();
    
    // Clean JSON markdown formatting if present
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }

    const vocabData = JSON.parse(text);

    // Now generate the image prompt
    const imagePromptReq = IMAGE_PROMPT_TEMPLATE
      .replace('{{WORD}}', vocabData.word)
      .replace('{{DEFINITION}}', vocabData.definition)
      .replace('{{PART_OF_SPEECH}}', vocabData.partOfSpeech)
      .replace('{{EXAMPLE_SENTENCE}}', vocabData.exampleSentence)
      .replace('{{DIFFICULTY_LEVEL}}', vocabData.difficultyLevel)
      .replace('{{CONTEXT}}', vocabData.context);

    const imageResult = await model.generateContent(imagePromptReq);
    const rawImagePrompt = imageResult.response.text().trim();
    
    // Fallback to pollinations.ai for actual image rendering
    const encodedImagePrompt = encodeURIComponent(rawImagePrompt);
    // Add random seed to avoid caching same prompts
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedImagePrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;

    return {
      ...vocabData,
      imageUrl
    };
  } catch (error: any) {
    console.error('Error generating vocab:', error);
    throw new Error(error.message || 'Failed to generate daily vocabulary. Please check your API key.');
  }
}
