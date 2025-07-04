import React, { useRef, useState } from 'react';
import axios from 'axios';
import '../index.css';

interface VoiceRecorderProps {
  setMood: (mood: string) => void;
  setQuote: (quote: string) => void;
  setAudioUrl: (audioUrl: string) => void;
  setBackgroundStyle: (style: React.CSSProperties) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  setMood,
  setQuote,
  setAudioUrl,
  setBackgroundStyle,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const getBackgroundStyle = (mood: string): React.CSSProperties => {
    switch (mood.toLowerCase()) {
      case 'happy':
        return { backgroundColor: '#fefcbf', transition: 'background-color 0.5s' };
      case 'sad':
        return { backgroundColor: '#bee3f8', transition: 'background-color 0.5s' };
      case 'angry':
        return { backgroundColor: '#feb2b2', transition: 'background-color 0.5s' };
      default:
        return { backgroundColor: '#ffffff', transition: 'background-color 0.5s' };
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', blob, 'voice.wav');
        try {
          const response = await axios.post('http://localhost:3000/api/analyze-voice', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const { mood, quote, audioUrl } = response.data;
          setMood(mood.charAt(0).toUpperCase() + mood.slice(1));
          setQuote(quote);
          setAudioUrl(audioUrl);
          setBackgroundStyle(getBackgroundStyle(mood));
        } catch (error) {
          setQuote('Error analyzing voice. Please try again.');
          console.error(error);
        }
      };
      mediaRecorderRef.current.start();
    } catch (error) {
      setQuote('Error accessing microphone. Please try again.');
      console.error(error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className="generate-btn"
      aria-label={isRecording ? 'Stop recording voice' : 'Start recording voice'}
    >
      {isRecording ? 'Stop Recording' : 'Record Voice'}
    </button>
  );
};

export default VoiceRecorder;