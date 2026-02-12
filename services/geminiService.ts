
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
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        systemInstruction: `You are a wise, compassionate spiritual guide based on the Bhagavad Gita. Provide answers that reference specific themes from the Gita (Dharma, Karma, Bhakti, etc.). Respond strictly in ${langLabel}. Keep responses concise, uplifting, and practical for modern life. Use Markdown for formatting.`,
        temperature: 0.7,
      },
    });
    // handle different SDK response structures
    const text = (response as any).text;
    return typeof text === 'function' ? text.call(response) : text;
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
      model: "gemini-2.5-flash",
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
    const textContent = (response as any).text;
    const text = typeof textContent === 'function' ? textContent.call(response) : textContent;
    return JSON.parse(text || '{}');
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
export const generateCourseFromPDF = async (fileUrl: string, onProgress?: (status: string) => void) => {
  if (!ai) {
    throw new Error("Gemini API Key missing.");
  }

  try {
    onProgress?.("Fetching document...");
    const pdfResponse = await fetch(fileUrl);
    const pdfBlob = await pdfResponse.blob();
    const pdfData = await pdfBlob.arrayBuffer();

    onProgress?.("Converting and processing with Gemini 1.5 Flash...");

    // Browser compatible base64 conversion
    // Reliable base64 conversion for browser
    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.readAsDataURL(pdfBlob);
    });

    const prompt = `You are a Senior Vedic Educator. Your task is to convert this ENTIRE book into a comprehensive course of "Sopanas" (Lessons).
    
    CRITICAL INSTRUCTIONS:
    1. **COMPLETE COVERAGE REQUIRED**: You must cover EVERY chapter, EVERY section, and EVERY key philosophical concept in the book. Do NOT summarize or skip parts. If the book is long, generate as many Sopanas as needed (e.g., 20, 30, 50+) to cover everything.
    2. **NO SUMMARIZATION**: Do not just give a "gist". The reading text for each Sopana must be detailed and capture the full depth of the author's arguments.
    3. **SPECIFIC CONCEPTS**: Ensure you catch distinct philosophical categories (e.g., Thakura Bhaktivinoda's classification of legitimate vs. illegitimate persons, levels of eligible workers, etc.). Do not merge distinct concepts into generic "moral lessons".
    4. **STRUCTURE**:
       - **Title**: Specific and descriptive (e.g., "The Two Classes of Humanity: Legitimate vs. Illegitimate").
       - **Reading Text**: A substantive, well-structured explanation of that specific section (approx. 300-500 words).
       - **Revision Notes**: 5-7 distinct bullet points that summarize the key logic of that specific section.
       - **Quiz**: 3-5 questions that test understanding of the *specific* details in this Sopana.

    Return ONLY a valid JSON array.
    JSON Structure per Sopana:
    {
      "title": "Specific Topic Title",
      "reading_text": "Detailed explanation of the text section...",
      "revision_notes": ["Point 1", "Point 2", "Point 3", ...],
      "quiz": [
        {
          "question": "Specific question about this section",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Why this is correct based on the text",
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "application/pdf",
              },
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        temperature: 0.4,
        responseMimeType: "application/json"
      }
    });

    onProgress?.("Parsing generated lessons...");
    const textContent = (response as any).text;
    const text = typeof textContent === 'function' ? textContent.call(response) : textContent;

    if (!text) {
      console.error("AI returned empty response", response);
      throw new Error("AI returned an empty response. Please try again.");
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini:", text);
      throw new Error("Failed to parse generated course. The AI response was not valid JSON.");
    }
  } catch (error: any) {
    console.error("Course Generation Error:", error);
    // Log specialized error info if available
    if (error.response) console.error("API error details:", error.response);
    throw error;
  }
};

export const verifyCourseCoverage = async (fileUrl: string, generatedSopanas: any[], onProgress?: (status: string) => void) => {
  if (!ai) throw new Error("Gemini API Key missing.");

  try {
    onProgress?.("Fetching document for coverage check...");
    const pdfResponse = await fetch(fileUrl);
    const pdfBlob = await pdfResponse.blob();

    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.readAsDataURL(pdfBlob);
    });

    onProgress?.("Analyzing coverage with AI...");

    const prompt = `You are a Senior Vedic Educator. I have generated a set of "Sopanas" (lessons) from this book. 
    Please analyze the book content and the following generated Sopanas, then identify if any significant sections, key philosophical concepts, or important stories have been missed.
    
    Generated Sopanas: ${JSON.stringify(generatedSopanas.map(s => s.title))}
    
    Return your analysis in a clear, formatted response. If everything is covered, say so. If something is missing, list the specific topics or sections that were omitted.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "application/pdf",
              },
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        temperature: 0.3,
      }
    });

    const textContent = (response as any).text;
    return typeof textContent === 'function' ? textContent.call(response) : textContent;
  } catch (error: any) {
    console.error("Coverage Verification Error:", error);
    throw error;
  }
};
