import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard, QuizQuestion, DrillItem, Difficulty } from "../types";

// Initialize Gemini Client
// IMPORTANT: API Key is assumed to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

export const generateFlashcards = async (topic: string, count: number = 10): Promise<Flashcard[]> => {
  const prompt = `Generate ${count} high-quality flashcards for the topic: "${topic}".
  The front should be a concept, term, or question.
  The back should be a clear, concise definition or answer.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING },
          },
          required: ["front", "back"],
        },
      },
    },
  });

  if (!response.text) return [];
  return JSON.parse(response.text) as Flashcard[];
};

export const generateQuiz = async (topic: string, difficulty: Difficulty, count: number = 5): Promise<QuizQuestion[]> => {
  const prompt = `Generate a ${difficulty} difficulty multiple-choice quiz about "${topic}" with ${count} questions.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"],
        },
      },
    },
  });

  if (!response.text) return [];
  return JSON.parse(response.text) as QuizQuestion[];
};

export const generateDrill = async (topic: string, count: number = 5): Promise<DrillItem[]> => {
  const prompt = `Generate ${count} "fill-in-the-blank" drill exercises for the topic: "${topic}".
  Return the full sentence, the missing word (key term), and the display sentence where the missing word is replaced by underscores (_____).`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            sentence: { type: Type.STRING },
            missingWord: { type: Type.STRING },
            displaySentence: { type: Type.STRING },
          },
          required: ["id", "sentence", "missingWord", "displaySentence"],
        },
      },
    },
  });

  if (!response.text) return [];
  return JSON.parse(response.text) as DrillItem[];
};
