import React, { useState, useEffect } from 'react';
import { Send, User, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function Chat({ openUploadModal, activeDocument }) {
  const docName = activeDocument?.name || activeDocument?.title || 'YASHMITHA P_ENG23CS0230.pdf';

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Now analyzing: "${docName}". How can I help you with this document?`,
      citation: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeDocument) {
      setMessages([
        {
          sender: 'ai',
          text: `Now analyzing: "${docName}". Ask any question about this document!`,
          citation: null
        }
      ]);
    }
  }, [activeDocument, docName]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userQuery = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/chat', {
        query: userQuery,
        filename: docName
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.data.answer,
          citation: res.data.citation
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error connecting to backend server. Make sure uvicorn is running on port 8000.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)', background: '#F8FAFC' }}>
      <div style={{ padding: '16px 32px', background: '#FFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ color: '#0F172A', fontSize: '15px' }}>📄 {docName}</strong>
        <span onClick={openUploadModal} style={{ color: '#6366F1', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
          + Upload / New Chat
        </span>
      </div>

      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '12px', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.sender === 'ai' && (
              <div style={{ background: '#6366F1', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexShrink: 0 }}>
                <Sparkles size={18} />
              </div>
            )}
            <div style={{
              background: m.sender === 'user' ? '#6366F1' : '#FFFFFF',
              color: m.sender === 'user' ? '#FFF' : '#1E293B',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: m.sender === 'ai' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              border: m.sender === 'ai' ? '1px solid #E2E8F0' : 'none'
            }}>
              <p style={{ margin: 0, lineHeight: '1.6', whiteSpace: 'pre-line' }}>{m.text}</p>
              {m.citation && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '10px', fontWeight: '500' }}>📌 {m.citation}</div>}
            </div>
            {m.sender === 'user' && (
              <div style={{ background: '#0EA5E9', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexShrink: 0 }}>
                <User size={18} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 32px', background: '#FFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '12px' }}>
        <input
          type="text"
          placeholder={loading ? "AI is thinking..." : "Ask a question about your document..."}
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px' }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{ background: '#6366F1', border: 'none', borderRadius: '8px', padding: '0 20px', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}