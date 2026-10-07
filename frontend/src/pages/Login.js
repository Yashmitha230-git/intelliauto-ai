import React, { useState } from 'react';
import { Mail, Lock, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) onLogin(email);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: '#0F172A' }}>
      {/* Left Branding / Hero Section */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        padding: '60px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.85)), url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#6366F1', padding: '10px', borderRadius: '12px', display: 'flex' }}>
            <Sparkles size={24} color="#FFF" />
          </div>
          <span style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px' }}>IntelliAuto AI</span>
        </div>

        <div style={{ maxWidth: '480px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px' }}>
            AI-Powered Document Intelligence for Automotive Systems.
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: '1.6' }}>
            Upload complex technical documentation, AUTOSAR specifications, or design PDFs and interact with instant, context-aware answers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '24px', color: '#94A3B8', fontSize: '14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={18} color="#10B981" /> Enterprise Secure</span>
          <span>•</span>
          <span>Fast RAG Query Engine</span>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div style={{
        width: '500px',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '32px' }}>Enter your details to access your workspace</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '8px' }}>Work Email</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px' }} />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: '#6366F1',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '8px',
                marginTop: '10px'
              }}
            >
              Sign In <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}