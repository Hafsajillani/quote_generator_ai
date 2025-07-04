import React from 'react';
import '../index.css';

interface QuoteDisplayProps {
  quote: string;
  audioUrl: string;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, audioUrl }) => {
  return (
    <div className="quote-display">
      <p className="quote-text">{quote || 'Your quote will appear here...'}</p>
      {audioUrl && <audio src={audioUrl} controls autoPlay className="quote-audio" />}
    </div>
  );
};

export default QuoteDisplay;