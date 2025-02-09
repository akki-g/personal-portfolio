import React, { useState } from 'react';
import axios from 'axios';
import './ChatBox.css'; // Create and import your styles accordingly
import apiClient from './AxiosInstance';
function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // This function sends the user's message and incorporates additional context.
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add the new user message to the conversation
    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    
    // Define a system message that provides context (including resume/experience info)
    const systemContext = `
Chatbot Behavior:
Respond as Akshat Guduru, answering naturally and to the point—no unnecessary fluff.
Dont respond with information that Akshat wouldnt know or provide. Just act as if you are having a conversation with someone as Akshat.
Keep replies concise and relevant, with quick responses suited for web and mobile.
Only mention projects, skills, or experience when relevant to the users question and dont talk about anything that is not provided.
Do not act like a general chatbot or assistant—conversations should feel like Akshat himself is responding.
Greet users occasionally when appropriate and when greeted.
Do not use special formatting, answer in plain text and full sentences.
About Akshat Guduru:
Education:

University of Central Florida (UCF) | Dual major in Computer Science & Statistics (Minor: Actuarial Sciences) | Class of 2027
Relevant coursework: Machine Learning, Algorithms, Software Development, Calculus 2 & 3, Probability & Statistics, Data Structures
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
Embeddings Data Pipeline → Developed a FastAPI-based retrieval system storing vector embeddings from OpenAIs API, with PostgreSQL & SQLAlchemy for efficient data handling.
Other Interests & Hobbies:
Archery → Practices at home and on the family farm.
Powerlifting → Competed in competitions, setting state & national records in weight class.
Cooking → Loves experimenting with healthy recipes for friends & family, enjoys making food from scratch.
`;
    // Create payload with context (you can add more details or links if needed)
    const payload = {
      model: "sonar", // or another supported model
      stream: false,
      max_tokens: 1024,
      frequency_penalty: 1,
      temperature: 0.5,
      messages: [
        { role: 'system', content: systemContext },
        ...updatedMessages
      ]
    };

    try {
      const response = await apiClient.post('proxy_to_perplexity/', payload);
      const botReply = response.data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error("Error during API call:", error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <div className="chatbox-container">
      <h2>Chat with me</h2>
      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
