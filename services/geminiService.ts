
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchWeatherAndMoonData(location: { lat?: number; lng?: number; zip?: string }): Promise<WeatherData> {
  const locationQuery = location.zip ? `ZIP code ${location.zip}` : `coordinates ${location.lat}, ${location.lng}`;
  
  const prompt = `
    Provide highly accurate current weather, moon position, and solunar fishing data for ${locationQuery}.
    Use IMPERIAL units for all measurements.
    
    I specifically need:
    1. Current temperature in Fahrenheit (°F), humidity in percentage (%), and barometric pressure in inches of mercury (inHg).
    2. Crucially, indicate if the barometric pressure is currently 'rising', 'falling', or 'steady' based on the most recent 3-hour trend.
    3. Precise moon data: current phase name, illumination percentage, azimuth (degrees), and altitude/elevation (degrees).
    4. Today's moonrise and moonset times for this location.
    5. Solunar Fishing Activity: 
       - Major fishing periods (typically two 2-hour windows).
       - Minor fishing periods (typically two 1-hour windows).
       - An activity rating (e.g., "Excellent", "Good", "Fair", or "Poor") based on solunar theory for today.
    6. The human-readable city or location name.
    
    Return the data strictly as a JSON object following this schema:
    {
      "locationName": string,
      "temperature": number,
      "humidity": number,
      "pressure": number,
      "pressureTrend": "rising" | "falling" | "steady",
      "condition": string,
      "moonData": {
        "phase": string,
        "illumination": number,
        "azimuth": number,
        "altitude": number,
        "moonrise": string,
        "moonset": string
      },
      "fishingTimes": {
        "majors": string[],
        "minors": string[],
        "rating": string
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data received from Gemini");

    const parsedData = JSON.parse(text);
    
    // Extract search grounding links
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Search Source",
      uri: chunk.web?.uri || "#"
    })) || [];

    return {
      ...parsedData,
      timestamp: new Date().toLocaleTimeString(),
      sources
    };
  } catch (error) {
    console.error("Error fetching data from Gemini:", error);
    throw error;
  }
}
