import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
if (!ELEVEN_LABS_API_KEY) {
  throw new Error("ELEVEN_LABS_API_KEY is not set in environment variables.");
}

const elevenlabs = new ElevenLabsClient({
  apiKey: ELEVEN_LABS_API_KEY,
});

const TEST_TEXT = "Hello, this is a test of the Eleven Labs text-to-speech functionality.";
const TEST_VOICE_ID = "apPaCOkljdxKYIV8LQlV"; // Replace with your valid Eleven Labs voice ID

async function readableToBuffer(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function testElevenLabsDirect() {
  try {
    console.log("Sending text-to-speech request to Eleven Labs API...");

    const audioStream = await elevenlabs.textToSpeech.convert(TEST_VOICE_ID, {
      model_id: "eleven_multilingual_v2",
      text: TEST_TEXT,
    });

    console.log("Received audio stream. Converting to buffer...");

    const audioBuffer = await readableToBuffer(audioStream);
    console.log("Audio buffer size:", audioBuffer.length);

    // Check MP3 header
    console.log("First 20 bytes of audio buffer:", audioBuffer.slice(0, 20));

    const outputPath = "output_audio.mp3";
    fs.writeFileSync(outputPath, audioBuffer, { encoding: "binary" });
    console.log(`Audio saved as '${outputPath}'. Play the file to verify.`);
  } catch (error) {
    console.error("Error testing Eleven Labs API:", error);
  }
}

testElevenLabsDirect();
