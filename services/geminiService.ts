
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSimulatedProviderResponse = async (
  providerName: string,
  serviceTitle: string,
  userMessage: string,
  chatHistory: { role: string, content: string }[]
): Promise<string> => {
  try {
    const historyString = chatHistory
      .map(h => `${h.role === 'user' ? 'Client' : providerName}: ${h.content}`)
      .join('\n');

    const prompt = `
      You are ${providerName}, a professional service provider offering "${serviceTitle}" on a local marketplace app.
      A potential client just messaged you: "${userMessage}".
      
      Previous conversation context:
      ${historyString}

      Response Guidelines:
      1. Be professional, friendly, and helpful.
      2. If they ask about rates or work samples, refer to your profile which mentions your rate.
      3. Try to schedule a meeting or ask clarifying questions about their task.
      4. Keep the response concise (1-3 sentences).
      5. Do not use generic AI greetings. Respond like a real human local worker.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "I'll get back to you shortly!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Thanks for reaching out! Let me check my schedule and get back to you.";
  }
};
