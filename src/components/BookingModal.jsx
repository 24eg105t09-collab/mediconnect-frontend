import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../api';
import { Calendar, Clock, DollarSign, X, CheckCircle, AlertTriangle } from 'lucide-react';

export default function BookingModal({ doctor, isOpen, onClose, currentUser, onBookingSuccess }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('Routine Checkup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (doctor && isOpen) {
      loadSlots();
    }
  }, [doctor, selectedDate, isOpen]);

  const loadSlots = async () => {
    if (!doctor) return;
    setLoading(true);
    setError(null);
    setSelectedSlot(null);
    try {
      const res = await appointmentApi.getSlots(doctor.id, selectedDate);
      setSlots(res.data);
    } catch (err) {
      setError("Failed to load doctor slots. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!currentUser || !currentUser.patientId) {
      alert("Please log in as a Patient to complete this booking.");
      return;
    }
    if (!selectedSlot) {
      alert("Please select an available time slot.");
      return;
    }

    setLoading(true);
    try {
      const res = await appointmentApi.book({
        patientId: currentUser.patientId,
        doctorId: doctor.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot.time,
        reason: reason
      });
      alert(`Booking Confirmed!\nDoctor: ${doctor.name}\nDate: ${selectedDate} at ${selectedSlot.time}\nQueue Position: #${res.data.queueNumber}\nEst. Wait: ~${res.data.estimatedWaitMinutes} mins`);
      if (onBookingSuccess) onBookingSuccess(res.data);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !doctor) return null;

  const morningSlots = slots.filter(s => parseInt(s.time.split(':')[0]) < 12);
  const afternoonSlots = slots.filter(s => {
    const hr = parseInt(s.time.split(':')[0]);
    return hr >= 12 && hr < 16;
  });
  const eveningSlots = slots.filter(s => parseInt(s.time.split(':')[0]) >= 16);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Book Doctor Appointment</h3>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {doctor.name} • <span style={{ color: '#0284c7', fontWeight: 600 }}>{doctor.specialization}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

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
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {/* Date Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
            Select Appointment Date:
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              width: '100%'
            }}
          />
        </div>

        {/* Slots Grid */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Available Time Slots:</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>🟢 Green = Available | ⚪ Strikethrough = Booked</span>
          </div>

          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading doctor availability from MySQL...</div>
          ) : slots.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              No available slots scheduled for this date.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Morning */}
              {morningSlots.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>MORNING (9 AM - 12 PM)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
                    {morningSlots.map((s, idx) => (
                      <button
                        key={idx}
                        className={`slot-btn ${s.available ? 'available' : 'booked'} ${selectedSlot?.time === s.time ? 'selected' : ''}`}
                        disabled={!s.available}
                        onClick={() => setSelectedSlot(s)}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Afternoon */}
              {afternoonSlots.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>AFTERNOON (12 PM - 4 PM)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
                    {afternoonSlots.map((s, idx) => (
                      <button
                        key={idx}
                        className={`slot-btn ${s.available ? 'available' : 'booked'} ${selectedSlot?.time === s.time ? 'selected' : ''}`}
                        disabled={!s.available}
                        onClick={() => setSelectedSlot(s)}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Evening */}
              {eveningSlots.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>EVENING (4 PM - 6 PM)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
                    {eveningSlots.map((s, idx) => (
                      <button
                        key={idx}
                        className={`slot-btn ${s.available ? 'available' : 'booked'} ${selectedSlot?.time === s.time ? 'selected' : ''}`}
                        disabled={!s.available}
                        onClick={() => setSelectedSlot(s)}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reason / Consultation Note */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
            Reason for Consultation:
          </label>
          <input
            type="text"
            placeholder="e.g. Skin checkup, Fever, Routine follow-up..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              width: '100%'
            }}
          />
        </div>

        {/* Booking Summary Box */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534' }}>Consultation Fee</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#15803d' }}>₹{doctor.consultationFee || 500}</div>
          </div>
          {selectedSlot && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534' }}>Est. Waiting Time</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#15803d' }}>
                ~{selectedSlot.estimatedWaitMinutes} minutes
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleBook}
            disabled={loading || !selectedSlot}
          >
            {loading ? "Confirming Booking..." : "Confirm & Book Slot"}
          </button>
        </div>
      </div>
    </div>
  );
}
