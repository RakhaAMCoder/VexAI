import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MODELS } from "../constants";
import { AspectRatio, ImageSize } from "../types";

export const generateImage = async (
  prompt: string, 
  aspectRatio: AspectRatio,
  size: ImageSize = '1K',
  referenceImageBase64?: string
): Promise<string> => {
  // Always create a new GoogleGenAI instance right before making an API call to ensure latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-pro-image-preview for all requests in this app to ensure high fidelity
  const model = MODELS.PRO;
  
  const parts: any[] = [{ text: prompt }];
  
  if (referenceImageBase64) {
    parts.unshift({
      inlineData: {
        data: referenceImageBase64.split(',')[1],
        mimeType: 'image/png'
      }
    });
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio,
        imageSize: size
      }
    }
  });

  // Guidelines: iterate through all parts to find the image part, do not assume it is the first part.
  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("Generation failed. The model did not return an image part.");
};

export const getChatAssistance = async (prompt: string, history: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: MODELS.CHAT,
    config: {
      systemInstruction: "You are Vex AI assistant. You help users generate perfect image prompts. Suggest artistic styles, lighting, and composition details. Be concise and creative."
    }
  });

  const response = await chat.sendMessage({ message: prompt });
  // Directly access .text property as per guidelines
  return response.text || "I'm sorry, I couldn't process that request.";
};