import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../api';
import { Calendar, Clock, AlertCircle, XCircle, User, Activity, CheckCircle2 } from 'lucide-react';

export default function PatientPortal({ currentUser, onBookClick, onOpenChatbot }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.patientId) {
      loadAppointments();
    }
  }, [currentUser]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.getPatientAppointments(currentUser.patientId);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error loading patient appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment? Your slot will be released back to the hospital schedule.")) {
      return;
    }
    try {
      await appointmentApi.cancel(appointmentId);
      alert("Appointment cancelled successfully. Slot is now released.");
      loadAppointments();
    } catch (err) {
      alert("Failed to cancel appointment: " + (err.response?.data?.message || err.message));
    }
  };

  if (!currentUser || currentUser.role !== 'PATIENT') {
    return (
      <div className="container" style={{ padding: '40px 16px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '32px' }}>
          <User size={48} color="#0284c7" style={{ margin: '0 auto 16px auto' }} />
          <h2>Patient Portal Login Required</h2>
          <p style={{ color: '#64748b', margin: '12px 0 20px 0' }}>
            Please sign in with a patient account to view your medical profile, live queue position, and booked appointments.
          </p>
          <div style={{ fontSize: '0.85rem', color: '#475569', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px' }}>
            💡 Demo Patient Login: Username: <strong>patient</strong> | Password: <strong>patient123</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Patient Welcome Header */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(to right, #ffffff, #f0fdf4)', borderColor: '#bbf7d0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Welcome, {currentUser.fullName}!</h2>
            <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
              Patient ID: #{currentUser.patientId} • Email: {currentUser.email}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-outline" onClick={onOpenChatbot}>
              Chat with AI Assistant
            </button>
            <button className="btn btn-primary" onClick={onBookClick}>
              + Book New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Your Appointments & Live Queue</h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Loading your appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <Calendar size={40} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
            <h3>No Appointments Booked Yet</h3>
            <p style={{ color: '#64748b', marginTop: '6px' }}>
              You don't have any upcoming doctor consultations.
            </p>
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={onBookClick}>
              Find a Doctor
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {appointments.map(app => (
              <div key={app.id} className="card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                borderLeft: app.status === 'CONFIRMED' ? '4px solid #10b981' : app.status === 'COMPLETED' ? '4px solid #0284c7' : '4px solid #ef4444'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{app.doctor.name}</h4>
                    <span className={`badge badge-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#0284c7', fontWeight: 600 }}>
                    {app.doctor.specialization} • Room {app.doctor.roomNumber}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                    Reason: {app.reason || 'General Consultation'}
                  </div>
                </div>

                {/* Queue & Time Metrics */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>DATE & TIME</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                      {app.appointmentDate}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>
                      {app.appointmentTime}
                    </div>
                  </div>

                  {app.status === 'CONFIRMED' && (
                    <div style={{
                      backgroundColor: '#eff6ff',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #bfdbfe',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: 600 }}>QUEUE POSITION</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d4ed8' }}>
                        #{app.queueNumber}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#3b82f6' }}>
                        Est. wait: ~{app.estimatedWaitMinutes} min
                      </div>
                    </div>
                  )}

                  {app.status === 'CONFIRMED' && (
                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                      onClick={() => handleCancel(app.id)}
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
