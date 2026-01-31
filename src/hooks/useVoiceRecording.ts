import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [duration, setDuration] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const startRecording = useCallback(() => {
    setError(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      toast({
        title: "Not Supported",
        description: "Speech recognition is not available in this browser. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-GB";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimText = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;

        if (result.isFinal) {
          finalText += transcriptText + " ";
        } else {
          interimText += transcriptText;
        }
      }

      if (finalText) {
        setTranscript((prev) => prev + finalText);
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      
      if (event.error === "not-allowed") {
        setError("Microphone access denied. Please enable microphone permissions.");
        toast({
          title: "Microphone Access Denied",
          description: "Please enable microphone permissions in your browser settings.",
          variant: "destructive",
        });
      } else if (event.error === "no-speech") {
        // This is normal, just restart
        return;
      } else {
        setError(`Recording error: ${event.error}`);
        toast({
          title: "Recording Error",
          description: `An error occurred: ${event.error}`,
          variant: "destructive",
        });
      }
      stopRecording();
    };

    recognition.onend = () => {
      // Auto-restart if still recording (browser sometimes stops)
      if (isRecording && recognitionRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Already started
        }
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      // Haptic feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (e) {
      console.error("Failed to start recording:", e);
      setError("Failed to start recording");
      toast({
        title: "Recording Failed",
        description: "Could not start recording. Please try again.",
        variant: "destructive",
      });
    }
  }, [isRecording, toast]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    setInterimTranscript("");

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  }, []);

  const resetRecording = useCallback(() => {
    stopRecording();
    setTranscript("");
    setDuration(0);
    setError(null);
  }, [stopRecording]);

  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  return {
    isRecording,
    transcript,
    interimTranscript,
    duration,
    isSupported,
    error,
    startRecording,
    stopRecording,
    resetRecording,
    formatDuration,
    setTranscript,
  };
}
