import { GoogleGenerativeAI } from "@google/generative-ai";
export const GEMINI_AI = {
  genAI: new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ""),
};
