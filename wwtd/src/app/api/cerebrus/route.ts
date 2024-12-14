import { NextResponse } from "next/server";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { PERSONALIZED_COMPANION_PROMPT } from "./prompts";

// Ensure API key is set
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;

if (!CEREBRAS_API_KEY) {
  console.error("CEREBRAS_API_KEY is not set in environment variables");
}

// Initialize Cerebras client
const client = new Cerebras({
  apiKey: CEREBRAS_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json();
    if (!body?.conversationId || !body?.messages) {
      return NextResponse.json(
        { error: "conversationId and messages are required", success: false },
        { status: 400 }
      );
    }

    const { conversationId, messages } = body;

    // Add the personalized prompt as the first system message
    const enrichedMessages = [
      { role: "system", content: PERSONALIZED_COMPANION_PROMPT },
      ...messages,
    ];

    console.log("Sending request to Cerebras API...");

    // Call the Cerebras API
    const chatCompletion = await client.chat.completions.create({
      model: "llama3.1-8b",
      messages: enrichedMessages,
    });

    // Extract and return the response
    const responseContent = chatCompletion?.choices[0]?.message?.content || "No response generated";

    // Optionally save the response to a database here (omitted for simplicity)

    return NextResponse.json({
      message: "LLM processed successfully",
      success: true,
      response: responseContent,
    });
  } catch (error) {
    console.error("LLM API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error", success: false },
      { status: 500 }
    );
  }
}
