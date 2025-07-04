import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import '../index.css';

interface VideoFeedProps {
  setMood: (mood: string) => void;
  setQuote: (quote: string) => void;
  setAudioUrl: (audioUrl: string) => void;
  setBackgroundStyle: (style: React.CSSProperties) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({
  setMood,
  setQuote,
  setAudioUrl,
  setBackgroundStyle,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    loadModels().then(startVideo);
  }, []);

  const detectMood = async () => {
    if (!videoRef.current) {
      setQuote('Error: Video feed not available.');
      return;
    }

    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detections || !detections.expressions) {
      setQuote('No face or expressions detected.');
      return;
    }

    const expressions = detections.expressions as faceapi.FaceExpressions;
    const expressionKeys = Object.keys(expressions) as (keyof faceapi.FaceExpressions)[];
    const mood = expressionKeys.reduce(
      (a, b) => (expressions[a] > expressions[b] ? a : b),
      'neutral' as keyof faceapi.FaceExpressions
    );

    try {
      const response = await axios.post('http://localhost:3000/api/generate-quote', { mood });
      setMood(mood.charAt(0).toUpperCase() + mood.slice(1));
      setQuote(response.data.quote);
      setAudioUrl(response.data.audioUrl);
      setBackgroundStyle(getBackgroundStyle(mood));
    } catch (error) {
      setQuote('Error generating quote. Please try again.');
      console.error('Error fetching quote:', error);
    }
  };

  return (
    <div className="video-container">
      <video ref={videoRef} autoPlay muted className="video-feed" />
      <button
        onClick={detectMood}
        className="generate-btn video-btn"
        aria-label="Generate quote using facial analysis"
      >
        Use Facial Analysis
      </button>
    </div>
  );
};

export default VideoFeed;