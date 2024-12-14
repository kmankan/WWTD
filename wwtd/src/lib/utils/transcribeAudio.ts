export const transcribeAudioStream = async (
  // Convert ReadableStream to Blob
  readable: ReadableStream,
  conversationId: string,
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
      "Content-Type": "audio/webm",
      "x-conversation-id": conversationId,
    },
  });
  return response.json();
};