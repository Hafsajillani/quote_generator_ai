import React from 'react';
import '../index.css';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About the Quote Generator</h1>
      <p className="about-text">
        This AI-powered quote generator uses voice tone analysis and facial expression detection
        to deliver personalized, uplifting quotes. Built with Gemini 2.5 Flash, it supports mental
        well-being by providing mood-appropriate quotes via text and voice, with dynamic background
        changes. Designed for accessibility, it aligns with MIT's mission to advance technology for
        human benefit.
      </p>
      <p className="about-text">
        <strong>Tech Stack:</strong> React, Vite, TypeScript, Gemini API, face-api.js.
      </p>
      <p className="about-text">
        <strong>Impact:</strong> Enhances emotional resilience for diverse users.
      </p>
    </div>
  );
};

export default About;