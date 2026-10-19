import React, { useState } from 'react';
import { authApi } from '../api';
import { User, Lock, Mail, Phone, X, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('PATIENT');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    age: 24,
    gender: 'Male',
    bloodGroup: 'O+',
    specialization: 'General Physician'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const res = await authApi.register({ ...formData, role });
        onLoginSuccess(res.data);
        onClose();
      } else {
        const res = await authApi.login({
          username: formData.username,
          password: formData.password
        });
        onLoginSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole) => {
    if (demoRole === 'PATIENT') {
      setFormData(prev => ({ ...prev, username: 'patient', password: 'patient123' }));
    } else if (demoRole === 'DOCTOR') {
      setFormData(prev => ({ ...prev, username: 'dr.ananya', password: 'doctor123' }));
    } else if (demoRole === 'ADMIN') {
      setFormData(prev => ({ ...prev, username: 'admin', password: 'admin123' }));
    }
    setIsRegister(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
            {isRegister ? 'Create MediConnect Account' : 'Sign In to MediConnect'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Quick Demo Switcher */}
        {!isRegister && (
          <div style={{ marginBottom: '16px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>QUICK DEMO ACCOUNTS:</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => handleDemoLogin('PATIENT')}>
                Demo Patient
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => handleDemoLogin('DOCTOR')}>
                Demo Doctor
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => handleDemoLogin('ADMIN')}>
                Demo Admin
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isRegister && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Account Type</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="radio" checked={role === 'PATIENT'} onChange={() => setRole('PATIENT')} /> Patient
                  </label>
                  <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="radio" checked={role === 'DOCTOR'} onChange={() => setRole('DOCTOR')} /> Doctor
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={loading}>
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#64748b' }}>
          {isRegister ? (
            <span>Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); setIsRegister(false); }} style={{ color: '#0284c7', fontWeight: 600 }}>Sign In</a></span>
          ) : (
            <span>Don't have an account? <a href="#register" onClick={(e) => { e.preventDefault(); setIsRegister(true); }} style={{ color: '#0284c7', fontWeight: 600 }}>Create an Account</a></span>
          )}
        </div>
      </div>
    </div>
  );
}
