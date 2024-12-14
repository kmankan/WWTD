export const transcribeAudioStream = async (
  // Convert ReadableStream to Blob
  readable: ReadableStream,
) => {
  const reader = readable.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const blob = new Blob(chunks, { type: "audio/webm" }); // Adjust mime type if needed

  const response = await fetch("/api/transcription", {
    method: "POST",
    body: blob,
    headers: {
      "Content-Type": "audio/webm"
    },
  });
  return response.json();
};