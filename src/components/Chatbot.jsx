import { useState, useRef, useEffect } from 'react';
import { RobotOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import { mockChatResponses } from '../data/mockData';

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m your Task Assistant. Ask me anything about your tasks.' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const responseIndex = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = mockChatResponses[responseIndex.current % mockChatResponses.length];
      responseIndex.current++;
      setMessages((prev) => [...prev, { from: 'bot', text: response }]);
      setTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <button className="chatbot-btn" onClick={() => setOpen(!open)}>
        {open ? <CloseOutlined /> : <RobotOutlined />}
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RobotOutlined style={{ fontSize: 18 }} />
              <h4>Task Assistant</h4>
            </div>
            <CloseOutlined
              style={{ cursor: 'pointer', fontSize: 14, opacity: 0.8 }}
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="chat-msg bot">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about tasks..."
            />
            <button onClick={handleSend}>
              <SendOutlined />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
