import { useEffect, useRef, useState } from 'react';
import apiClient from '../pages/AxiosInstance';
import { links } from '../content';
import './Chat.css';

const SUGGESTIONS = [
  'What is your research about?',
  'What did you work on at IBM?',
  'What is CitePilot built with?',
];

const MAX_CHARS = 800;   // matches the server's per-turn limit
const MAX_TURNS = 12;    // the server only keeps the last 12 turns

function Chat() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const logRef = useRef(null);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, pending]);

  const ask = async (question) => {
    const text = question.trim();
    if (!text || pending) return;

    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setDraft('');
    setError(null);
    setPending(true);

    // Send the most recent turns, starting on a question.
    let recent = next.slice(-MAX_TURNS);
    if (recent[0].role !== 'user') recent = recent.slice(1);

    try {
      const { data } = await apiClient.post('chat/', { messages: recent });
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (requestError) {
      const status = requestError.response?.status;
      setError(status === 429
        ? 'That’s a lot of questions for now. Try again in a bit, or email me.'
        : requestError.response?.data?.error || 'Something went wrong. Try again, or email me.');
      setMessages(messages); // drop the unanswered question so it can be re-sent
      setDraft(text);
    } finally {
      setPending(false);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    ask(draft);
  };

  return (
    <div className="grid chat">
      <div className="chat-side">
        <h2 id="chat-title">Ask about me</h2>
        <p>
          Questions about my research, projects or experience. Answers are written by AI from my résumé and
          project notes, so check anything important with me at <a href={`mailto:${links.email}`}>{links.email}</a>.
        </p>
      </div>

      <div className="chat-main">
        {messages.length > 0 && (
          <ol className="chat-log" ref={logRef} aria-live="polite" aria-label="Conversation">
            {messages.map((message, index) => (
              <li key={index} className={`chat-turn is-${message.role}`}>
                <b>{message.role === 'user' ? 'You' : 'Answer'}</b>
                <p>{message.content}</p>
              </li>
            ))}
            {pending && (
              <li className="chat-turn is-assistant">
                <b>Answer</b>
                <p>Thinking…</p>
              </li>
            )}
          </ol>
        )}

        {messages.length === 0 && (
          <div className="chat-suggestions" aria-label="Example questions">
            {SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => ask(suggestion)} disabled={pending}>
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form className="chat-form" onSubmit={onSubmit}>
          <label htmlFor="chat-input" className="visually-hidden">Your question</label>
          <input
            id="chat-input"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={MAX_CHARS}
            placeholder="Ask a question"
            autoComplete="off"
            disabled={pending}
          />
          <button type="submit" disabled={pending || !draft.trim()}>Ask</button>
        </form>

        {error && <p className="chat-error" role="alert">{error}</p>}
      </div>
    </div>
  );
}

export default Chat;
