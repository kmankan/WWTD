"use client"
import { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

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
  const [showModal, setShowModal] = useState(true);
  const [isMobile] = useState(() => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

  useEffect(() => {
    // Only initialize if conversationId
    if (conversationId) {
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

              await transcribeAudioStream(audioStream, conversationId);
              const response = await callLLM(conversationId);
              setCurrentMessage(response.response);
              setConversationState("speaking");
              console.log("Voice: ", voice);
              await generateSpeech(response.response, voice);
              setConversationState("thinking");
            }
          };
        } catch (error) {
          console.error("Error initializing media recorder:", error);
        }
      };

      initMediaRecorder();
      console.log("Media recorder initialized");
      console.log("Voice: ", voice);
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [conversationId, voice]);

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
    console.log("Stopping audio", isMobile ? "on mobile" : "on desktop");
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("Audio stopped");
      setConversationState("thinking");

      // Pre-initialize audio for both mobile and desktop
      const audio = new Audio();
      try {
        if (isMobile) {
          // Mobile needs more careful initialization
          audio.muted = true;
          await audio.play().catch(() => { });
          audio.pause();
          audio.muted = false;
          console.log("Mobile audio pre-initialized");
        } else {
          // Desktop initialization
          await audio.play().catch(() => { });
          audio.pause();
          console.log("Desktop audio pre-initialized");
        }
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

  const handleStartSession = async () => {
    // create a new conversation
    const conversation = await createNewConversation();
    setConversationId(conversation.id);
    setConversationInitiated(true);
    console.log("Conversation created with id: ", conversation.id);
    setShowModal(false);
  };

  return (
    <button
      className="w-36 h-36 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
      onClick={() => {
        console.log("clicked");
      }}
    >
      <Mic className="w-8 h-8 text-white" />
    </button>
  );
};

export default RecordButton;