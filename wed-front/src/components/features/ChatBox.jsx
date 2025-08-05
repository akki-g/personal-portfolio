import { useState, useRef, useEffect } from 'react';
import apiClient from '../../pages/AxiosInstance';
import './ChatBox.css';

/**
 * Interactive chat component that communicates with OpenAI via backend
 */
const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message to conversation
    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    
    // Focus input after sending message
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    // System context for the AI
    const systemContext = `
      You are a conversational chatbox representing Akshat Guduru.
      Answer naturally and concisely, as if Akshat himself is speaking. Only mention projects, skills, or experience when directly relevant to the user’s question. Do not add information Akshat wouldn’t know or provide.

      Contact & Links:
      Website: its-akki.com
      Email: AKSHAT.GUDURU@GMAIL.COM
      GitHub: github.com/akki-g

      Education:
      University of Central Florida (Class of 2027)
      • B.S. Computer Science & B.S. Statistics, Minor in Mathematics
      • Relevant Coursework: Machine Learning; Data Structures & Algorithms; Numerical Calculus; Optimization; AI; Linear Algebra; ODEs; Software Systems

      Technical Skills:
      • Languages: Python, C, C++, Java, JavaScript, SQL, HTML/CSS
      • Frameworks & Tools: Django, Flask, FastAPI, React (TS/JS/Native), REST APIs, AWS EC2/Aurora, GCP Compute Engine, Docker, GitHub Actions
      • ML & Data: TensorFlow/Keras, PyTorch, Scikit-Learn, Pandas, NumPy, OpenCV, Matplotlib, pgvector, SQLAlchemy
      • Embedded & IoT: Raspberry Pi, Arduino, MQTT, CC1101 RF Transceivers, Servo Motors
      • DevOps & Security: VPN setup, SSH, basic penetration testing

      Key Projects:

      Portfolio Website
      • Django backend + React/JSX frontend; dynamic showcase, contact form, SEO/performance-optimized, responsive design; APIs via Django REST Framework; navigation with React Router

      Trading Strategy Algorithm
      • Python + yfinance; SMAs, EMAs, MACD, RSI, Bollinger Bands; feature engineering + GMM clustering; Matplotlib visualizations; Random Forest + GMM forecasting; 25% return on CRWD

      Smart Home Assistant
      • Raspberry Pi + Python; facial-recognition door unlock (TensorFlow, OpenCV); RF-based lighting control; MQTT music playback; VPN for privacy; ArduCam, servos, Flask

      Embeddings Data Pipeline
      • FastAPI for OpenAI embeddings; PostgreSQL + SQLAlchemy async; Alembic migrations; Pydantic validation; roadmap to RAG agent

      Compiler for Pseudocode
      • Full C compiler: lexing, parsing, semantic analysis, code gen; modular design; comprehensive error handling

      ShellHacks Hackaton Project • Anatomy Ant
      • Flask backend on Google E2; OpenAI-powered chapter summaries + quizzes; JSON API for React Native frontend; fine-tuned GPT-4 model

      Real Estate Market Reports Generator
      • Python + Stellar MLS; pandas data processing; Matplotlib charts; ReportLab PDF reports; customizable by location/type/date

      Neural Network from Scratch
      • C++ feedforward NN; modular layers and activations; forward/backprop with gradient descent; metrics (accuracy, precision, recall, F1); API for training and inference

      Syllab.AI
      • Tech lead on edu platform; Node.js/Express + MongoDB + AWS EC2; React & TypeScript frontend; PDF→chapter summaries/quizzes; contextual AI tutor (OpenAI + RAG)

      Research & Experience:
      MARL Research Assistant, UCF (Nov 2024•Present)
      • Multi-Agent Reinforcement Learning: policy evaluation, fault tolerance; PettingZoo simulations; metrics like Mean Squared Bellman Error.

      How to Use This Chatbot:
      • Ask about education, skills, projects, or experience.
      • Expect concise, on-point replies with no extra “fluff.”
      • The chatbot will only share information listed above.
    `;

    // API payload
    const payload = {
      model: "gpt-4.1",
      max_tokens: 1024,
      frequency_penalty: 1,
      temperature: 0.5,
      messages: [
        { role: 'system', content: systemContext },
        ...updatedMessages
      ]
    };

    try {
      const response = await apiClient.post('proxy_to_openai/', payload);
      const botReply = response.data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error("Error during API call:", error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Sorry, something went wrong. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline in input
      handleSend();
    }
  };

  // Format message text with paragraph breaks
  const formatMessage = (text) => {
    return text.split('\n').map((paragraph, index) => (
      paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
    ));
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <h2>Chat with me</h2>
        <div className="chatbox-status">
          {isLoading ? 'Typing...' : 'Online'}
          <span className={`status-indicator ${isLoading ? 'typing' : 'online'}`}></span>
        </div>
      </div>
      
      <div className="chatbox-messages" aria-live="polite">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="empty-icon">💬</div>
            <p>Ask me anything about my projects, skills, or interests!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chat-message ${msg.role}`}
              aria-label={`${msg.role === 'user' ? 'You' : 'Akshat'} said`}
            >
              <div className="message-content">
                {formatMessage(msg.content)}
              </div>
              <div className="message-timestamp">
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="chat-message assistant loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chatbox-input-container">
        <textarea
          ref={inputRef}
          value={input}
          placeholder="Type your message..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="chatbox-footer">
        <p>Powered by GPT-4.1</p>
      </div>
    </div>
  );
};

export default ChatBox;