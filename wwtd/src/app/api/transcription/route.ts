import { NextResponse } from "next/server";
import { sendToDeepgram } from "@/lib/utils/sendToDeepgram";
import { addMessage } from "@/lib/db/queries";

export async function POST(request: Request) {
  // * 1. primsa query to store trascript in Messages table
  try {
    // get the conversation id from the request headers
    const conversationId = request.headers.get("x-conversation-id");
    console.log("conversationId", conversationId);

    if (!conversationId) {
      console.error("Conversation ID is required");
      return NextResponse.json(
        {
          message: "Conversation ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    // get the audio buffer from the request
    const audioBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    // transcribe the audio buffer
    // ? Would it be better to make this a utility function that returns the transcript and also calls the LLM
    const result = await sendToDeepgram(buffer);
    console.log("result", result);

    // add the message to the conversation
    await addMessage(conversationId, result, "user");

    return NextResponse.json({
      message: "Audio processed successfully",
      success: true,
      transcript: result,
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      {
        message: "Error processing audio",
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}