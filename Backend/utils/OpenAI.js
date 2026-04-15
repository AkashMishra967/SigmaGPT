import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


export const OpenAiResponse = async (message) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: message }
      ],
    });

    const reply = response.choices[0].message.content;

    
    console.log("User:", message);
    console.log("AI:", reply);

    return reply;

  } catch (error) {
    console.error("ERROR in OpenAI:", error.message);
    throw error;
  }
};
export default OpenAiResponse;