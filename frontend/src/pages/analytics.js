import React from 'react';

export default function Analytics() {
  return (
    <div className="dashboard-view">
      <h2>Analytics & Usage Overview</h2>
      
      <div className="stats-grid" style={{ marginTop: '20px' }}>
        <div className="stat-card">
          <div>
            <div className="stat-lbl">Total Uploads</div>
            <div className="stat-val">3</div>
            <span style={{ color: '#10B981', fontSize: '12px' }}>↑ 20%</span>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-lbl">Total Queries</div>
            <div className="stat-val">8</div>
            <span style={{ color: '#10B981', fontSize: '12px' }}>↑ 33%</span>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-lbl">Avg Response Time</div>
            <div className="stat-val">1.2s</div>
            <span style={{ color: '#10B981', fontSize: '12px' }}>↓ 45%</span>
          </div>
        </div>
      </div>

      <div className="doc-list-card" style={{ marginTop: '24px' }}>
        <h3>Profile & Subscription Plan</h3>
        <p style={{ marginTop: '8px', color: '#64748B' }}>User: <strong>Yashmitha P</strong> (yashmitha@example.com)</p>
        <div style={{ marginTop: '16px', padding: '16px', background: '#EEF2FF', borderRadius: '8px', color: '#635BFF' }}>
          <strong>Current Plan: Pro</strong>
          <p style={{ fontSize: '12px', color: '#4338CA', marginTop: '4px' }}>Unlimited uploads, Advanced AI models, Priority support</p>
        </div>
      </div>
    </div>
  );
}