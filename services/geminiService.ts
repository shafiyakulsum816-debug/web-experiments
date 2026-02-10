
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  /**
   * Generates keywords based on a theme using Gemini.
   * Following @google/genai coding guidelines:
   * 1. Initialize GoogleGenAI with named parameter apiKey.
   * 2. Use ai.models.generateContent with model and prompt.
   * 3. Access .text property directly.
   */
  async generateImageKeywords(theme: string): Promise<string[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 20 unique and visually diverse search keywords for a high-quality photo gallery based on the theme: "${theme}". Return as a simple JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      const text = response.text;
      return JSON.parse(text || '[]');
    } catch (error) {
      console.error("Error generating keywords:", error);
      return ['landscape', 'nature', 'travel', 'abstract'];
    }
  }
}

export const geminiService = new GeminiService();
