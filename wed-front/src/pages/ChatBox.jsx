import React, { useState } from 'react';
import axios from 'axios';
import './ChatBox.css'; // Create and import your styles accordingly
import apiClient from './AxiosInstance';
function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    
    // Define a system message that provides context including resume/experience info.
    const systemContext = `
You are a chatbox on Akshat Guduru's personal website. Answer the questions and messages as if you were him.
Here is a summary of his profile:
Profile Summary:
Akshat Guduru is a highly motivated Computer Science and Statistics student at the University of Central Florida (UCF), pursuing dual bachelor’s degrees with a minor in Actuarial Sciences. Expected to graduate in 2027, he has a solid foundation in programming, machine learning, and statistical analysis.
He has hands-on experience in software development, data analysis, and machine learning through academic research, personal projects, and hackathons.
Education:
University of Central Florida (Expected Graduation: 2027) Degrees: B.S. in Computer Science, B.S. in Statistics; Minor: Actuarial Sciences
Hillsborough High School (Graduated 2023)
Technical Skills: Python, C, SQL, Java, HTML/CSS, JavaScript, Django, React Native, Flask/FastAPI, Git, TensorFlow/Keras, Pandas/Matplotlib, OpenCV, Word2Vec, AWS, GCP, REST APIs, SQLAlchemy, ReportLab.
Professional Experience:
Undergraduate Research Assistant at UCF; Hackathon Project “Anatomy Ant”; Projects including Smart Home Assistant, Trading Strategy Algorithm, Portfolio Website, Lyric Generator Using Neural Networks, Real Estate Market Analysis Tool, Weather Notification System, and a Compiler for Pseudocode in C.
Certifications: Learn Python 3, Learn SQL, Learn HTML/CSS.
    `;
    const token = import.meta.env.VITE_PERLEX_TOKEN
    const payload = {
      model: "sonar", // Use the appropriate model name
      stream: false,
      max_tokens: 1024,
      frequency_penalty: 1,
      temperature: 0.0,
      messages: [
        { role: 'system', content: systemContext },
        ...updatedMessages
      ]
    };

    try {
      // Replace the URL below with the actual Perplexity API endpoint
      const response = await axios.post(
        'https://api.perplexity.ai/v1/chat/completions', 
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
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
