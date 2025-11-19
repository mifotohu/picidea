import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// We define the schema for the expected JSON output
const suggestionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    craftType: {
      type: Type.STRING,
      description: "The specific craft technique identified (e.g., 'Macrame', 'Watercolor', 'Amigurumi')."
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique short id" },
          title: { type: Type.STRING, description: "A catchy title for a Pinterest Board" },
          description: { type: Type.STRING, description: "Short description of why this is inspiring" },
          searchQuery: { type: Type.STRING, description: "Optimized search keywords for Pinterest" },
          category: { type: Type.STRING, description: "Category tag (e.g. 'Colors', 'Pattern', 'Style')" }
        },
        required: ["id", "title", "description", "searchQuery", "category"]
      }
    }
  },
  required: ["craftType", "suggestions"]
};

export const analyzeImageForPinterest = async (
  apiKey: string,
  base64Image: string,
  mimeType: string
): Promise<AnalysisResult> => {
  
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze this image of a handmade/craft item. 
    Your goal is to act as a Pinterest Curator.
    1. Identify the specific craft technique and style.
    2. Generate 6 distinct ideas for Pinterest searches that would inspire the creator of this item.
    3. Suggest searches related to: similar patterns, complementary color palettes, advanced techniques, and styling ideas.
    4. Output MUST be in Hungarian (Magyar).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: suggestionSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};