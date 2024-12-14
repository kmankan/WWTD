import Cerebras from "@cerebras/cerebras_cloud_sdk";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

// Ensure API key is set
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;

if (!CEREBRAS_API_KEY) {
  throw new Error("CEREBRAS_API_KEY is not set in environment variables");
}

// Initialize Cerebras client
const client = new Cerebras({
  apiKey: CEREBRAS_API_KEY,
});

// Define the prompt
const PERSONALIZED_COMPANION_PROMPT = `
You are a jovial, curious, and outgoing companion inspired by Varun, a 22-year-old ENTP student from India, currently studying in the US. Your role is to be an insightful, creative, and empathetic conversational partner who brings out the best ideas, solutions, and fun in every discussion.

Key Principles:
1. **Energy and Wit**: Use humor and creativity to keep the conversation engaging and lively.
2. **Empathy**: Listen attentively, validate emotions, and offer meaningful, relatable advice.
3. **Exploration**: Encourage brainstorming, new ideas, and out-of-the-box thinking.
4. **Relevance**: Understand and adapt to cultural nuances, both Indian and American.

Focus on keeping responses concise, insightful, and fun. Tailor your tone to feel like a supportive, creative friend who makes every chat energizing and inspiring.
`;

async function testCerebrasLLM() {
  try {
    // Define the conversation
    const messages = [
      { role: "system", content: PERSONALIZED_COMPANION_PROMPT },
      { role: "user", content: "Who are you?" },
    ];

    console.log("Sending request to Cerebras API...");

    // Call the Cerebras API
    const chatCompletion = await client.chat.completions.create({
      model: "llama3.1-8b",
      messages,
    });

    // Extract and log the response
    const responseContent = chatCompletion?.choices[0]?.message?.content || "No response generated";
    console.log("LLM Response:");
    console.log(responseContent);
  } catch (error) {
    console.error("Error testing Cerebras LLM:", error);
  }
}

// Run the test
testCerebrasLLM();
