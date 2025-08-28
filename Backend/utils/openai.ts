
import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});



const generateOpenAiResponse = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { text: message }  
      ],
    });
    return response.text;
  } catch (e) {
    console.log(e);
  }
};

export default generateOpenAiResponse;