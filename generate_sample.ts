import { GoogleGenAI } from "@google/genai";

async function generateSampleAvatar() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: "A high-quality 3D cartoon avatar of a cheerful Vietnamese schoolboy, wearing a white shirt and red scarf, friendly smile, vibrant colors, soft lighting, white background, Pixar style" }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      console.log("IMAGE_DATA_START");
      console.log(part.inlineData.data);
      console.log("IMAGE_DATA_END");
    }
  }
}

generateSampleAvatar();
