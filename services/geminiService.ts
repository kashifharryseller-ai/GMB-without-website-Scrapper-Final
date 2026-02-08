
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, SearchParams } from "../types";

export const findLeads = async (params: SearchParams): Promise<Lead[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  try {
    // Stage 1: Search & Grounding (Gemini 2.5 Flash + Google Maps)
    const searchPrompt = `Find local businesses in the category "${params.keyword}" in "${params.location}".
    I only want businesses that appear to have a Google Business Profile.
    I need their Name, Phone, Address, and GMB URL.
    Important: Try to find businesses that don't have a visible website in their listing.
    Retrieve up to ${params.maxResults * 1.5} raw results to allow for strict filtering.`;

    const searchResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: searchPrompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const rawData = searchResponse.text;
    const groundingMetadata = searchResponse.candidates?.[0]?.groundingMetadata;
    
    // Stage 2: Deep Verification & Strategic Analysis (Gemini 3 Pro + Thinking)
    const analysisPrompt = `You are a Digital Transformation Auditor. I have raw data from Google Maps.
    
    --- RAW DATA ---
    ${rawData}
    
    --- GROUNDING DATA ---
    ${JSON.stringify(groundingMetadata)}
    
    --- TASK ---
    1. PROPER DEEP CHECK: For every business listed, verify if they have a website. If there is ANY mention of a website URL, domain, or booking link, EXCLUDE THEM immediately. I ONLY want GMB-only businesses.
    2. DATA SANITIZATION:
       - Phone: Convert to strict international WhatsApp format (+[CC][Digits]). Remove all symbols/spaces.
    3. AI WEBSITE STRATEGY: 
       - Calculate 'lead_score' (0-100) based on niche high-ticket value.
       - Create a 'reasoning' brief: 1 sentence on the revenue gap.
       - Create a 'website_prompt': A detailed, professional prompt (2-3 paragraphs) that the user can copy into an AI website builder (like Framer or Wix Studio) to generate a full site for this specific business. Include GMB details in the prompt.
    4. DEDUPLICATION: Ensure unique results only.

    Return a JSON array of maximum ${params.maxResults} high-quality leads.`;

    const finalResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: analysisPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              phone: { type: Type.STRING },
              address: { type: Type.STRING },
              lead_score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              website_prompt: { type: Type.STRING, description: "The copy-pasteable AI website builder prompt" },
              maps_url: { type: Type.STRING }
            },
            required: ["name", "phone", "address", "lead_score", "reasoning", "website_prompt", "maps_url"]
          }
        }
      }
    });

    return JSON.parse(finalResponse.text.trim());
  } catch (error) {
    console.error("Critical Gemini Service Error:", error);
    throw new Error("Deep scan failed. The Maps API might be experiencing high latency, or your query was too broad.");
  }
};
