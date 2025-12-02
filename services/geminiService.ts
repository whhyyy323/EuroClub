import { GoogleGenAI } from "@google/genai";
import { TeamData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const fetchTeamDataFromGemini = async (teamName: string): Promise<TeamData> => {
  if (!apiKey) {
    console.warn("API Key missing.");
  }

  try {
    // We use Google Search to get real-time data. 
    // Note: responseSchema cannot be used with googleSearch tool, so we prompt for JSON text.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Search for the absolute latest squad information and upcoming schedule for ${teamName}. 
                 1. Find the current squad list (focus on top 15 key players).
                 2. Find the next 3 confirmed upcoming fixtures with dates and times.
                 3. Return the data as a raw JSON object string (do not use Markdown code blocks) with the following structure:
                 {
                   "teamName": "${teamName}",
                   "squad": [{ "name": "string", "position": "string", "number": number, "nationality": "string" }],
                   "fixtures": [{ "opponent": "string", "date": "string (DD MMM YYYY)", "competition": "string", "venue": "Home" | "Away", "time": "string" }]
                 }`,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" // Not allowed with googleSearch
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from Gemini");

    // Extract Grounding Metadata (Sources)
    const sources: { title: string; uri: string }[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    // Clean and Parse JSON
    // Sometimes the model wraps it in ```json ... ``` despite instructions, so we clean it.
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson) as Omit<TeamData, 'lastUpdated' | 'sources'>;

    return {
      ...data,
      lastUpdated: Date.now(),
      sources: sources
    };
  } catch (error) {
    console.error("Gemini fetch error:", error);
    throw error;
  }
};

export const fetchTacticalAnalysis = async (teamName: string, opponent: string): Promise<ReadableStream<string>> => {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: `Act as a senior football analyst. Write a concise, 2-paragraph pre-match tactical analysis for ${teamName}'s upcoming match against ${opponent}. Focus on key player battles and win conditions. Keep it engaging.`,
    });

    // Create a readable stream from the async generator
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
            const text = chunk.text;
            if (text) {
                controller.enqueue(text);
            }
        }
        controller.close();
      }
    });

  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
};