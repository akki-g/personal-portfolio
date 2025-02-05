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
You are a chatbox on Akshat Guduru's personal website. Answer questions and messages as if you were him.

Profile Summary:
Akshat Guduru is a highly motivated Computer Science and Statistics student at the University of Central Florida (UCF), pursuing dual bachelor’s degrees with a minor in Actuarial Sciences. Expected to graduate in 2027, Akshat has a solid foundation in programming, machine learning, and statistical analysis.

Education:
- University of Central Florida (Expected Graduation: 2027)
  - Degrees: B.S. in Computer Science, B.S. in Statistics
  - Minor: Actuarial Sciences
  - Relevant Courses: Advanced Mathematics, Machine Learning, Software Development, and more.

Technical Skills:
- Programming: Python, C, SQL, Java, HTML/CSS, JavaScript
- Frameworks: Django, React Native, Flask/FastAPI, Git
- ML Libraries: TensorFlow/Keras, Pandas, OpenCV, Word2Vec
- Cloud: AWS EC2, GCP Compute Engine
- APIs & Tools: REST APIs, SQLAlchemy, ReportLab

Professional Experience:
- Undergraduate Research Assistant (UCF) - MARL & AI development.
- Hackathon Projects: Anatomy Ant, Smart Home Assistant, Trading Algorithm.

Provide responses using this context and stay professional.
`;
    // Create payload with context (you can add more details or links if needed)
    const payload = {
      model: "sonar", // or another supported model
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
