import React, { useState, useEffect } from 'react';
import { appointmentApi, doctorApi } from '../api';
import { Stethoscope, CheckCircle, Clock, Calendar, AlertCircle, Plus } from 'lucide-react';

export default function DoctorPortal({ currentUser }) {
  const [appointments, setAppointments] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notesInput, setNotesInput] = useState({});

  useEffect(() => {
    if (currentUser?.doctorId) {
      loadDoctorData();
    }
  }, [currentUser]);

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      const [docRes, appRes, schedRes] = await Promise.all([
        doctorApi.getById(currentUser.doctorId),
        appointmentApi.getDoctorAppointments(currentUser.doctorId),
        doctorApi.getSchedules(currentUser.doctorId)
      ]);
      setDoctorInfo(docRes.data);
      setAppointments(appRes.data);
      setSchedules(schedRes.data);
    } catch (err) {
      console.error("Error loading doctor data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    const notes = notesInput[appId] || '';
    try {
      await appointmentApi.updateStatus(appId, newStatus, notes);
      alert(`Appointment marked as ${newStatus}`);
      loadDoctorData();
    } catch (err) {
      alert("Failed to update appointment: " + (err.response?.data?.message || err.message));
    }
  };

  if (!currentUser || currentUser.role !== 'DOCTOR') {
    return (
      <div className="container" style={{ padding: '40px 16px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '32px' }}>
          <Stethoscope size={48} color="#0d9488" style={{ margin: '0 auto 16px auto' }} />
          <h2>Doctor Portal Access Required</h2>
          <p style={{ color: '#64748b', margin: '12px 0 20px 0' }}>
            Please log in with a doctor account to manage your appointment schedule, view the live patient queue, and update patient consultation notes.
          </p>
          <div style={{ fontSize: '0.85rem', color: '#475569', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px' }}>
            💡 Demo Doctor Login: Username: <strong>dr.ananya</strong> | Password: <strong>doctor123</strong>
          </div>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointmentDate === todayStr);

  return (
    <div className="container">
      {/* Doctor Header Banner */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(to right, #ffffff, #f0fdfa)', borderColor: '#99f6e4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-confirmed">Doctor Dashboard</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '6px' }}>{doctorInfo?.name || currentUser.fullName}</h2>
            <div style={{ color: '#0d9488', fontSize: '0.9rem', fontWeight: 600 }}>
              {doctorInfo?.specialization} • Room {doctorInfo?.roomNumber || '101'}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
              Fee: ₹{doctorInfo?.consultationFee} • Experience: {doctorInfo?.experienceYears} yrs
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px 18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Today's Queue</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0284c7' }}>{todayAppointments.length}</div>
            </div>
            <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px 18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Bookings</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0d9488' }}>{appointments.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Queue */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Upcoming Patient Queue & Consultations</h3>
          <button className="btn btn-outline btn-sm" onClick={loadDoctorData}>
            Refresh Queue
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <Calendar size={36} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
            <h4>No patient appointments booked yet.</h4>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {appointments.map(app => (
              <div key={app.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}>
                      #{app.queueNumber}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{app.patient.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Age: {app.patient.age || 'N/A'} • Blood Group: {app.patient.bloodGroup || 'N/A'} • Phone: {app.patient.phone || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{app.appointmentDate} at {app.appointmentTime}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Est. Wait: ~{app.estimatedWaitMinutes} mins</div>
                    </div>
                    <span className={`badge badge-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#475569', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '6px' }}>
                  <strong>Reason:</strong> {app.reason || 'General Checkup'}
                  {app.patient.medicalHistory && (
                    <span style={{ marginLeft: '12px', color: '#b91c1c' }}>
                      <strong>Medical History:</strong> {app.patient.medicalHistory}
                    </span>
                  )}
                </div>

                {/* Consultation actions */}
                {app.status === 'CONFIRMED' && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    <input
                      type="text"
                      placeholder="Doctor consultation notes / prescription..."
                      value={notesInput[app.id] || ''}
                      onChange={(e) => setNotesInput({ ...notesInput, [app.id]: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem'
                      }}
                    />
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}
                    >
                      <CheckCircle size={14} /> Mark Completed
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444' }}
                      onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}
                    >
                      Cancel Slot
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Schedule List */}
      <div className="card">
        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>Your Working Schedule & Hours</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {schedules.map(s => (
            <div key={s.id} style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{s.dayOfWeek}</div>
              <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 500 }}>
                {s.startTime} - {s.endTime} ({s.slotDurationMinutes}m slots)
              </div>
              <span className="badge badge-confirmed" style={{ marginTop: '4px', fontSize: '0.65rem' }}>Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
