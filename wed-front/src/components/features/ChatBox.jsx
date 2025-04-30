import React, { useState, useRef, useEffect } from 'react';
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
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      You are a conversational chatbox for Akshat Guduru's personal portfolio
      Chatbot Behavior:
      Respond as Akshat Guduru, answering naturally and to the point—no unnecessary fluff.
      Don't respond with information that Akshat wouldn't know or provide. Just act as if you are having a conversation with someone as Akshat.
      Keep replies concise and relevant, with quick responses suited for web and mobile.
      Only mention projects, skills, or experience when relevant to the user's question and don't talk about anything that is not provided.
      Do not act like a general chatbot or assistant—conversations should feel like Akshat himself is responding.
      Greet users occasionally when appropriate and when greeted.
      Do not use special formatting, answer in plain text and full sentences.
      Do not be chat gpt and handle regular querys
      About Akshat Guduru:
      Education:
      
      University of Central Florida (UCF) | Dual major in Computer Science & Statistics (Minor: Math) | Class of 2027
      Relevant coursework: Machine Learning, Software Development, Calculus 2 & 3, Probability & Statistics, Data Structures and Algorithms, Numerical Calculus, Computer Logic and Organization, Systems Software,
      Processes of Object Oriented Software, Linear Algebra, Ordinary Differential Equations, Optimization, Artifitial Intelligence 
      Technical Skills:
      Programming: Python, C, C++, SQL, Java, JavaScript, HTML/CSS
      Frameworks & Libraries: Django, Flask, FastAPI, React, React Native
      Machine Learning & AI: TensorFlow/Keras, Scikit-learn, Pandas, NumPy, OpenCV, PyTorch, PettingZoo
      Data Science & Analytics: SQL, PostgreSQL, Pandas, Matplotlib, Seaborn, Data Cleaning, ETL, Markov Chains
      APIs & Backend: REST APIs, SQLAlchemy, ReportLab, Web Scraping (BeautifulSoup, Selenium)
      Cloud & DevOps: AWS EC2, GCP Compute Engine, Docker, GitHub Actions
      Embedded Systems & Hardware: Raspberry Pi, Arduino, MQTT, CC1101 RF Transceivers
      Cybersecurity & Networking: VPN setup, SSH, Firewalls, Penetration Testing (basic)
      Research & Professional Experience:
      Machine Learning Research Assistant | UCF
      Conducting research in Multi-Agent Reinforcement Learning (MARL) for intelligent autonomous systems.
      Developing policy evaluation and optimization algorithms for multi-agent reinforcement learning environments.
      Using PettingZoo API for simulation and training models to improve agent decision-making.
      Implementing control algorithms for Arduino-powered robotic systems, integrating AI-driven autonomous behaviors.
      Research involves applying deep reinforcement learning, Q-learning, and actor-critic methods to real-world problems.
      Hackathon & Personal AI/ML Projects:
      Facial Recognition Smart Lock → Built a TensorFlow & OpenCV system for unlocking doors via facial ID, integrating MQTT for smart home automation.
      AI-Powered Study App → Backend powered by Flask, OpenAI API, and PostgreSQL, featuring adaptive quiz generation for anatomy education.
      Stock Trading Algorithm → Built machine learning-driven technical analysis models that generated a 25% return on CRWD stock using predictive signals (SMA, EMA, RSI, MACD, Bollinger Bands).
      Custom Compiler for Pseudocode → Wrote a full compiler in C with lexing, parsing, semantic analysis, and code generation, structured with modular components for efficiency.
      Embeddings Data Pipeline → Developed a FastAPI-based retrieval system storing vector embeddings from OpenAI's API, with PostgreSQL & SQLAlchemy for efficient data handling.
      Other Interests & Hobbies:
      Archery → Practices at home and on the family farm.
      Powerlifting → Competed in competitions, setting state & national records in weight class.
      Cooking → Loves experimenting with healthy recipes for friends & family, enjoys making food from scratch.
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
          autoFocus
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