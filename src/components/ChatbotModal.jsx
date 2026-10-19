import React, { useState, useEffect, useRef } from 'react';
import { chatbotApi, appointmentApi } from '../api';
import { Bot, Send, X, Clock, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ChatbotModal({ isOpen, onClose, currentUser, onAppointmentBooked }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "👋 Hi! I'm MediConnect AI, your smart hospital assistant.\nI check real-time doctor availability from our hospital database to help you find the right specialist and book appointments instantly.",
      suggestions: ['Find a Dermatologist', 'Available Doctors Today', 'Check Cardiology Slots', 'I have chest pain and shortness of breath']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => 'sess_' + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatbotApi.sendMessage({
        message: textToSend,
        sessionId: sessionId,
        patientId: currentUser?.patientId || null
      });

      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: res.data.reply,
        suggestions: res.data.suggestions || [],
        slots: res.data.slots || [],
        intent: res.data.intent,
        data: res.data.data
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: "I'm having trouble connecting to the hospital database right now. Please ensure the backend is running.",
          suggestions: ['Available Doctors Today', 'Try Again']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slot) => {
    if (!currentUser || !currentUser.patientId) {
      alert("Please log in as a patient first to book this appointment.");
      return;
    }

    setLoading(true);
    try {
      const res = await appointmentApi.book({
        patientId: currentUser.patientId,
        doctorId: slot.doctorId,
        appointmentDate: slot.date,
        appointmentTime: slot.time,
        reason: 'Booked via MediConnect AI Assistant'
      });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'assistant',
          text: `🎉 Confirmed! Your appointment with ${slot.doctorName} on ${slot.date} at ${slot.time} is booked successfully!\n• Queue Position: #${res.data.queueNumber}\n• Estimated wait: ~${res.data.estimatedWaitMinutes} mins`,
          suggestions: ['View My Appointments', 'Ask another question']
        }
      ]);

      if (onAppointmentBooked) {
        onAppointmentBooked(res.data);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'assistant',
          text: `⚠️ Could not book slot: ${errMsg}`,
          suggestions: ['Find another slot', 'Available Doctors Today']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '580px', height: '620px', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>MediConnect AI Assistant</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Live Doctor Availability & Smart Booking</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat message history */}
        <div className="chat-messages" style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
                style={{ whiteSpace: 'pre-line' }}
              >
                {msg.text}
              </div>

              {/* Render Doctor Slots Card inside chat if provided by backend */}
              {msg.slots && msg.slots.length > 0 && (
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px',
                  margin: '4px 0 8px 0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> Available Slots from MySQL:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                    {msg.slots.map((slot, idx) => (
                      <button
                        key={idx}
                        className={`slot-btn ${slot.available ? 'available' : 'booked'}`}
                        disabled={!slot.available}
                        onClick={() => handleBookSlot(slot)}
                        title={slot.available ? `Book slot with ${slot.doctorName}` : 'Slot already booked'}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 8px' }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{slot.time}</span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>{slot.doctorName}</span>
                        <span style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 600 }}>₹{slot.consultationFee}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestion Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '2px 0 6px 0' }}>
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      className="suggestion-pill"
                      onClick={() => handleSend(sug)}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-bubble chat-bubble-assistant" style={{ fontStyle: 'italic', color: '#64748b' }}>
              Checking MySQL doctor schedules...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            display: 'flex',
            gap: '8px'
          }}
        >
          <input
            type="text"
            placeholder="Ask about a doctor, symptom, or slot (e.g. 'Dermatologist tomorrow')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !input.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
