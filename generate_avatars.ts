import { GoogleGenAI } from "@google/genai";

async function generateAvatars() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompts = [
    "A cute 3D cartoon horse mascot for a school class, friendly expression, vibrant colors, white background, high quality",
    "A friendly Vietnamese female teacher in a modern Ao Dai, smiling, professional yet warm, 3D cartoon style, white background",
    "A cheerful Vietnamese schoolboy in a white shirt and red scarf, smiling, 3D cartoon style, white background",
    "A cheerful Vietnamese schoolgirl in a white shirt and red scarf, smiling, 3D cartoon style, white background"
  ];

  const results = [];
  for (const prompt of prompts) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        results.push(`data:image/png;base64,${part.inlineData.data}`);
      }
    }
  }
  
  console.log(JSON.stringify(results));
}

generateAvatars();
