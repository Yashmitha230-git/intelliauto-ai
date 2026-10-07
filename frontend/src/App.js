import React, { useState, useEffect } from "react";
import "./app.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [currentFile, setCurrentFile] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.recent_documents && data.recent_documents.length > 0) {
          setCurrentFile(data.recent_documents[data.recent_documents.length - 1]);
        }
      })
      .catch((err) => console.error("Error connecting to backend:", err));
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".pdf")) {
      alert("Please upload a valid PDF file.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentFile(data.name);
        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            text: `Document "${data.name}" uploaded successfully. Ask any question below!`,
          },
        ]);
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`Upload failed: ${errData.detail || response.statusText}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Cannot connect to backend server. Make sure Uvicorn is running on port 8000.");
    } finally {
      setIsUploading(false); // ALWAYS resets button state so it doesn't get stuck!
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setInputQuery("");

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsProcessing(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userText,
          filename: currentFile,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.answer,
          citation: data.citation,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Error communicating with backend server.",
          citation: "System Error",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">⚡</span>
          <h1>IntelliAuto AI</h1>
        </div>
        <div className="upload-wrapper">
          <label htmlFor="pdf-upload" className="upload-btn">
            {isUploading ? "Uploading..." : "📄 Upload PDF"}
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            style={{ display: "none" }}
          />
        </div>
      </header>

      <main className="app-main">
        <aside className="status-panel">
          <h3>Active Context</h3>
          <div className="status-card">
            <span className="status-indicator"></span>
            <div>
              <p className="status-label">Document Loaded</p>
              <p className="status-value">{currentFile || "No document"}</p>
            </div>
          </div>
          <div className="info-box">
            <h4>Instructions</h4>
            <p>Upload any AUTOSAR HLD, technical manual, or resume PDF and ask queries for instant dynamic extraction.</p>
          </div>
        </aside>

        <section className="chat-section">
          <div className="chat-history">
            {messages.length === 0 && (
              <div className="empty-state">
                <p>👋 Ready to analyze. Select a PDF and type your question below.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.text}
                  {msg.citation && <div className="message-citation">📍 {msg.citation}</div>}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="chat-message ai">
                <div className="message-bubble loading">Analyzing document content...</div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              placeholder="Ask a question about the document..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isProcessing}
            />
            <button type="submit" disabled={isProcessing || !inputQuery.trim()}>
              Send
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;