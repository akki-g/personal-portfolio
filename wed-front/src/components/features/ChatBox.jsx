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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
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

      Below this message, the server appends a live, up-to-date list of Akshat's
      projects and experience pulled directly from the database. Treat that
      appended data as the authoritative source for project and experience details.

      How to Use This Chatbot:
      • Ask about education, skills, projects, or experience.
      • Expect concise, on-point replies with no extra “fluff.”
      • The chatbot will only share information provided to it in this context.
      • If you ask about something not in the context, it will respond with "I don't have that information."
      • DO NOT RETURN RESPONSES IN MARKDOWN FORMAT. KEEP IT PLAIN TEXT.
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
        <div>
          <span className="chatbox-label">Portfolio assistant</span>
          <h2>Ask about Akshat</h2>
        </div>
        <div className="chatbox-status">
          {isLoading ? 'Typing...' : 'Online'}
          <span className={`status-indicator ${isLoading ? 'typing' : 'online'}`}></span>
        </div>
      </div>
      
      <div className="chatbox-messages" aria-live="polite">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 15a3 3 0 01-3 3H9l-5 3v-3.5A3 3 0 012 15V6a3 3 0 013-3h12a3 3 0 013 3v9z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>What would you like to know?</h3>
            <p>Try asking about research, technical skills, or a recent project.</p>
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
          placeholder="Ask a question…"
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
        <p>AI-generated answers may make mistakes.</p>
      </div>
    </div>
  );
};

export default ChatBox;
