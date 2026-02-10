
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

// Resilient initialization
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (import.meta as any).env.GEMINI_API_KEY || process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error("Failed to initialize Gemini Client", e);
  }
} else {
  console.warn("⚠️ Gemini API Key missing. AI features will use fallback responses.");
}

export const getGitaInsight = async (query: string, language: Language = 'en') => {
  if (!ai) {
    return language === 'hi'
      ? "मैं इस समय कनेक्ट नहीं कर पा रहा हूँ (API कुंजी गायब है)।"
      : "I cannot connect at this moment (API Key missing).";
  }
  try {
    const langLabel = language === 'hi' ? 'Hindi' : 'English';
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: `You are a wise, compassionate spiritual guide based on the Bhagavad Gita. Provide answers that reference specific themes from the Gita (Dharma, Karma, Bhakti, etc.). Respond strictly in ${langLabel}. Keep responses concise, uplifting, and practical for modern life. Use Markdown for formatting.`,
        temperature: 0.7,
      },
    });
    // response.text is a property, returning the string output
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'hi'
      ? "मैं वर्तमान में आपके प्रश्न पर ध्यान कर रहा हूँ। कृपया एक क्षण में पुनः प्रयास करें।"
      : "I am currently meditating on your question. Please try again in a moment.";
  }
};

export const getVerseOfTheDay = async (language: Language = 'en') => {
  if (!ai) {
    return {
      reference: "Chapter 2, Verse 47",
      sanskrit: "karmaṇy-evādhikāras te mā phaleṣu kadācana...",
      translation: language === 'hi'
        ? "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। आपको अपने निर्धारित कर्तव्यों का पालन करने का अधिकार है, लेकिन आप कर्मों के फल के अधिकारी नहीं हैं।"
        : "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
      application: language === 'hi'
        ? "परिणाम के बजाय प्रयास पर ध्यान दें। (डेमो मोड)"
        : "Focus on the effort, not the outcome. (Demo Mode)"
    };
  }

  try {
    const langLabel = language === 'hi' ? 'Hindi' : 'English';
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Select a random uplifting verse from the Bhagavad Gita and provide its Sanskrit transliteration, ${langLabel} translation, and a short modern application in ${langLabel}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reference: { type: Type.STRING },
            sanskrit: { type: Type.STRING },
            translation: { type: Type.STRING },
            application: { type: Type.STRING },
          },
          required: ["reference", "sanskrit", "translation", "application"],
        },
      },
    });
    // Use .text property to get string output
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      reference: "Chapter 2, Verse 47",
      sanskrit: "karmaṇy-evādhikāras te mā phaleṣu kadācana...",
      translation: language === 'hi'
        ? "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। आपको अपने निर्धारित कर्तव्यों का पालन करने का अधिकार है, लेकिन आप कर्मों के फल के अधिकारी नहीं हैं।"
        : "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
      application: language === 'hi'
        ? "परिणाम के बजाय प्रयास पर ध्यान दें। यह चिंता को कम करता है और प्रदर्शन में सुधार करता है।"
        : "Focus on the effort, not the outcome. This reduces anxiety and improves performance."
    };
  }
};
