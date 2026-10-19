import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DoctorFinder from './components/DoctorFinder';
import PatientPortal from './components/PatientPortal';
import DoctorPortal from './components/DoctorPortal';
import AdminPortal from './components/AdminPortal';
import ChatbotModal from './components/ChatbotModal';
import BookingModal from './components/BookingModal';
import LoginModal from './components/LoginModal';
import { Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('finder');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mediconnect_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mediconnect_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mediconnect_user');
    }
  }, [currentUser]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'PATIENT') setActiveTab('patient');
    else if (user.role === 'DOCTOR') setActiveTab('doctor');
    else if (user.role === 'ADMIN') setActiveTab('admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('finder');
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctorForBooking(doctor);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {activeTab === 'finder' && (
          <DoctorFinder
            onSelectDoctor={handleSelectDoctor}
            onOpenChatbot={() => setIsChatbotOpen(true)}
          />
        )}

        {activeTab === 'patient' && (
          <PatientPortal
            currentUser={currentUser}
            onBookClick={() => setActiveTab('finder')}
            onOpenChatbot={() => setIsChatbotOpen(true)}
          />
        )}

        {activeTab === 'doctor' && (
          <DoctorPortal
            currentUser={currentUser}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Floating AI Chatbot Action Button */}
      <button 
        className="chatbot-fab"
        onClick={() => setIsChatbotOpen(true)}
        title="Chat with MediConnect AI"
      >
        <Bot size={22} />
        <span>Ask AI Assistant</span>
      </button>

      {/* Modals */}
      <ChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        currentUser={currentUser}
        onAppointmentBooked={() => {
          // Refresh patient data if in patient portal
        }}
      />

      <BookingModal
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
        currentUser={currentUser}
        onBookingSuccess={() => {
          setSelectedDoctorForBooking(null);
          setActiveTab('patient');
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
