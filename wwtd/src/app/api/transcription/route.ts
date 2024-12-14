import { NextResponse } from "next/server";
import { transcribeFile } from "@/lib/utils/transcribeFile";

export async function POST(request: Request) {
  // * 1. primsa query to store trascript in Messages table
  try {
    // get the audio buffer from the request
    const audioBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    // transcribe the audio buffer
    // ? Would it be better to make this a utility function that returns the transcript and also calls the LLM
    const result = await transcribeFile(buffer);
    console.log("result", result);

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