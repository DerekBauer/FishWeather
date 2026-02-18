
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchWeatherAndMoonData(location: { lat?: number; lng?: number; zip?: string }): Promise<WeatherData> {
  const locationQuery = location.zip ? `ZIP code ${location.zip}` : `coordinates ${location.lat}, ${location.lng}`;
  
  const prompt = `
    Provide highly accurate current weather, wind, moon position, solunar fishing data, and coastal tide data for ${locationQuery}.
    Use IMPERIAL units for all measurements (Fahrenheit, mph, inHg, feet).
    
    I specifically need:
    1. Current temperature in Fahrenheit (°F), humidity in percentage (%), and barometric pressure in inches of mercury (inHg).
    2. Indicate if the barometric pressure is currently 'rising', 'falling', or 'steady' based on the most recent 3-hour trend.
    3. HISTORICAL PRESSURE DATA: Provide the approximate barometric pressure (inHg) from 2, 6, 12, and 24 hours ago for this specific location.
    4. Precise moon data: current phase name, illumination percentage, azimuth (degrees), and altitude/elevation (degrees).
    5. Today's moonrise and moonset times for this location.
    6. Detailed Wind Data: Current sustained speed (mph), wind gust speed (mph), direction in degrees (0-359), and cardinal direction.
    7. Solunar Fishing Activity: 
       - Major fishing periods (typically two 2-hour windows).
       - Minor fishing periods (typically two 1-hour windows).
       - An activity rating (e.g., "Excellent", "Good", "Fair", or "Poor") based on solunar theory for today.
    8. Tide Data (ONLY if the location is coastal or near tidal water):
       - Station name.
       - The next 4 tide events (High or Low) with their predicted times and heights in feet.
    9. The human-readable city or location name.
    
    Return the data strictly as a JSON object following this schema:
    {
      "locationName": string,
      "temperature": number,
      "humidity": number,
      "pressure": number,
      "pressureTrend": "rising" | "falling" | "steady",
      "pressureHistory": {
        "past2h": number,
        "past6h": number,
        "past12h": number,
        "past24h": number
      },
      "condition": string,
      "moonData": {
        "phase": string,
        "illumination": number,
        "azimuth": number,
        "altitude": number,
        "moonrise": string,
        "moonset": string
      },
      "windData": {
        "speed": number,
        "gust": number,
        "direction": number,
        "cardinal": string
      },
      "fishingTimes": {
        "majors": string[],
        "minors": string[],
        "rating": string
      },
      "tideData": {
        "station": string,
        "events": [
          { "type": "High" | "Low", "time": string, "height": string }
        ]
      } | null
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
