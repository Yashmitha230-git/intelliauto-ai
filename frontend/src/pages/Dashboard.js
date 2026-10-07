import React from 'react';
import { UploadCloud, FileText, MessageSquare, Clock } from 'lucide-react';

export default function Dashboard({ stats, documents, openUploadModal }) {
  return (
    <div className="dashboard-view">
      <div className="welcome-header">
        <h2>Good morning, Yashmitha 👋</h2>
        <p>Upload your engineering documents and start asking questions.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EEF2FF', color: '#635BFF' }}><FileText /></div>
          <div>
            <div className="stat-val">{stats.total_uploads || 3}</div>
            <div className="stat-lbl">Total Documents</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#E0F2FE', color: '#0EA5E9' }}><MessageSquare /></div>
          <div>
            <div className="stat-val">{stats.total_queries || 8}</div>
            <div className="stat-lbl">Total Chats</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#DCFCE7', color: '#10B981' }}><Clock /></div>
          <div>
            <div className="stat-val">{stats.saved_time || '12 hrs'}</div>
            <div className="stat-lbl">Saved Time</div>
          </div>
        </div>
      </div>

      <div className="upload-dropzone">
        <UploadCloud size={48} color="#635BFF" />
        <h3 style={{ margin: '12px 0 4px' }}>Upload a Document</h3>
        <p style={{ color: '#64748B', fontSize: '14px' }}>Drag & drop your PDF, or click to browse</p>
        <span style={{ fontSize: '12px', color: '#94A3B8' }}>Supports PDF files only (max 50MB)</span>
        <br />
        <button className="upload-btn-purple" onClick={openUploadModal}>Choose File</button>
      </div>

      <div className="doc-list-card">
        <h3>Recent Documents</h3>
        <div style={{ marginTop: '16px' }}>
          {(documents || []).map((doc) => (
            <div className="doc-item" key={doc.id}>
              <div className="doc-info">
                <FileText color="#EF4444" />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{doc.name}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{doc.uploaded}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}