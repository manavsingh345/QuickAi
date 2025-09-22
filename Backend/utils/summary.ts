import generateOpenAiResponse from "./openai.js";

export const generateTitleFromMessage = async (userMessage: string): Promise<string> => {
  const prompt = `
Generate a short and relevant chat title (max 6 words) based on this user message:

"${userMessage}"

Only return the title — no explanations.
`;

  const title = await generateOpenAiResponse(prompt);

  // Remove any line breaks or extra spaces
  return (title || "New Chat").trim().replace(/\s+/g, " ");
};
