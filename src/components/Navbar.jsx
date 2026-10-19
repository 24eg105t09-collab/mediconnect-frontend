import React from 'react';
import { Activity, User, LogOut, ShieldCheck, Stethoscope, Users, MessageSquare } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, onLoginClick, onLogout, onOpenChatbot }) {
  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => setActiveTab('finder')}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
              MediConnect <span style={{ color: '#0284c7' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
              Smart Hospital & Doctor Scheduling
            </div>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className={`btn ${activeTab === 'finder' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('finder')}
          >
            <Stethoscope size={16} /> Find Doctors
          </button>

          <button 
            className={`btn ${activeTab === 'patient' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('patient')}
          >
            <Users size={16} /> Patient Portal
          </button>

          <button 
            className={`btn ${activeTab === 'doctor' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('doctor')}
          >
            <Stethoscope size={16} /> Doctor Portal
          </button>

          <button 
            className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('admin')}
          >
            <ShieldCheck size={16} /> Admin
          </button>
        </div>

        {/* User Status / Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenChatbot}
            title="Open AI Availability Assistant"
          >
            <MessageSquare size={16} /> AI Chat
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser.fullName}</div>
                <div style={{ fontSize: '0.725rem', color: '#0284c7', textTransform: 'uppercase', fontWeight: 600 }}>
                  {currentUser.role}
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={onLogout} title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onLoginClick}>
              <User size={16} /> Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
