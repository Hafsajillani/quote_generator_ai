import React, { useState } from 'react';
import QuoteDisplay from '../components/quote-display';
import VoiceRecorder from '../components/voice-recorder';
import VideoFeed from '../components/video-feed';
import axios from 'axios';
import '../index.css';

const Home: React.FC = () => {
  const [mood, setMood] = useState<string>('None');
  const [quote, setQuote] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({
    backgroundColor: '#ffffff',
  });

  const handleManualMood = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mood = e.target.value;
    setMood(mood.charAt(0).toUpperCase() + mood.slice(1));
    setBackgroundStyle(
      mood.toLowerCase() === 'happy'
        ? { backgroundColor: '#fefcbf', transition: 'background-color 0.5s' }
        : mood.toLowerCase() === 'sad'
        ? { backgroundColor: '#bee3f8', transition: 'background-color 0.5s' }
        : mood.toLowerCase() === 'angry'
        ? { backgroundColor: '#feb2b2', transition: 'background-color 0.5s' }
        : { backgroundColor: '#ffffff', transition: 'background-color 0.5s' }
    );
    try {
      const response = await axios.post('http://localhost:3000/api/generate-quote', { mood });
      setQuote(response.data.quote);
      setAudioUrl(response.data.audioUrl);
    } catch (error) {
      setQuote('Error generating quote. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="home-container" style={backgroundStyle}>
      <h1 className="home-title">Mood-Based Quote Generator</h1>
      <p className="home-mood">Detected Mood: {mood}</p>
      <div className="home-controls">
        <VoiceRecorder
          setMood={setMood}
          setQuote={setQuote}
          setAudioUrl={setAudioUrl}
          setBackgroundStyle={setBackgroundStyle}
        />
        <VideoFeed
          setMood={setMood}
          setQuote={setQuote}
          setAudioUrl={setAudioUrl}
          setBackgroundStyle={setBackgroundStyle}
        />
        <select
          onChange={handleManualMood}
          className="home-select"
          aria-label="Select mood manually"
        >
          <option value="neutral">Select Mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="angry">Angry</option>
        </select>
      </div>
      <QuoteDisplay quote={quote} audioUrl={audioUrl} />
    </div>
  );
};

export default Home;