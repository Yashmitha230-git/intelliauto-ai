import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

export default function UploadModal({ closeModal, onUploadSuccess, navigateToChat }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");
    
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setLoading(false);
      onUploadSuccess();
      navigateToChat();
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Upload failed. Make sure FastAPI backend is running on http://localhost:8000");
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '400px', position: 'relative' }}>
        <button onClick={closeModal} style={{ position: 'absolute', right: '15px', top: '15px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} />
        </button>
        <h3>Select PDF to Process</h3>
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} style={{ margin: '20px 0' }} />
        <button 
          onClick={handleUpload} 
          disabled={loading} 
          style={{ width: '100%', padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {loading ? 'Uploading...' : 'Confirm Upload'}
        </button>
      </div>
    </div>
  );
}