"use client"
import { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { useChatStore } from '../store/chat';
import { transcribeAudioStream } from '@/lib/utils/transcribeAudio';

export const RecordButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [volumeLevels, setVolumeLevels] = useState<number[]>(Array(15).fill(0));
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const {
    conversationState,
    setConversationState,
    conversationId,
    setConversationId,
    setCurrentMessage,
    setConversationInitiated,
    voice,
  } = useChatStore();

  useEffect(() => {
    const initMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Create and resume audio context
        const context = new AudioContext();
        await context.resume();
        const analyserNode = context.createAnalyser();
        analyserNode.fftSize = 32;

        const source = context.createMediaStreamSource(stream);
        source.connect(analyserNode);

        setAudioContext(context);
        setAnalyser(analyserNode);

        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            const audioBlob = new Blob([event.data], { type: "audio/wav" });
            const audioStream = audioBlob.stream();

            const transcription = await transcribeAudioStream(audioStream);
            console.log("Transcription: ", transcription);
            // const response = await callLLM(conversationId);
            // setCurrentMessage(response.response);
            // setConversationState("speaking");
            // console.log("Voice: ", voice);
            // await generateSpeech(response.response, voice);
            // setConversationState("thinking");
          }
        };
      } catch (error) {
        console.error("Error initializing media recorder:", error);
      }
    };

    initMediaRecorder();
    console.log("Media recorder initialized");
    console.log("Voice: ", voice);

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [voice]);

  /// For audio animation
  useEffect(() => {
    let animationFrameId: number;

    const updateVolumeLevels = () => {
      if (analyser && isRecording) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        const newLevels = Array.from(dataArray)
          .slice(0, 15)
          .map(value => value / 255);

        setVolumeLevels(newLevels);
      }
      animationFrameId = requestAnimationFrame(updateVolumeLevels);
    };

    if (isRecording) {
      updateVolumeLevels();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRecording, analyser]);
  // console.log(volumeLevels);

  const recordAudio = async () => {
    try {
      console.log("Recording audio");
      if (mediaRecorder && audioContext) {
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        mediaRecorder.start();
        setIsRecording(true);
        console.log("Recording started");
        setConversationState("listening");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopAudio = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("Audio stopped");
      setConversationState("thinking");

      // Pre-initialize audio
      const audio = new Audio();
      try {
        await audio.play().catch(() => { });
        audio.pause();
        console.log("Audio pre-initialized");
      } catch (e) {
        console.log("Audio pre-initialization failed:", e);
      }
    }
  };

  // For space bar recording  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault(); // Prevent default space bar behavior (scrolling)
        if (isRecording) {
          stopAudio();
        } else {
          recordAudio();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRecording]);

  return (
    <button
      className="w-36 h-36 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
      onClick={() => isRecording ? stopAudio() : recordAudio()}
    >
      <Mic className="w-8 h-8 text-white" />
    </button>
  );
};

export default RecordButton;