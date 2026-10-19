import React, { useState, useEffect } from 'react';
import { adminApi, appointmentApi, doctorApi } from '../api';
import { ShieldCheck, Users, Calendar, Award, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

export default function AdminPortal({ currentUser }) {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      loadAdminData();
    }
  }, [currentUser]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, appRes, docRes] = await Promise.all([
        adminApi.getStats(),
        appointmentApi.getAll(),
        doctorApi.getAll()
      ]);
      setStats(statsRes.data);
      setAppointments(appRes.data);
      setDoctors(docRes.data);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="container" style={{ padding: '40px 16px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '32px' }}>
          <ShieldCheck size={48} color="#6366f1" style={{ margin: '0 auto 16px auto' }} />
          <h2>Admin Portal Access Restricted</h2>
          <p style={{ color: '#64748b', margin: '12px 0 20px 0' }}>
            Please log in with hospital administrator credentials to view analytics, doctors, and all hospital bookings.
          </p>
          <div style={{ fontSize: '0.85rem', color: '#475569', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px' }}>
            💡 Demo Admin Login: Username: <strong>admin</strong> | Password: <strong>admin123</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Hospital Administration & Analytics</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time hospital operations, doctors, and appointment metrics.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>TOTAL PATIENTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', margin: '6px 0' }}>
            {stats?.totalPatients || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669' }}>Registered in Database</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #0d9488' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>TOTAL DOCTORS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0d9488', margin: '6px 0' }}>
            {stats?.totalDoctors || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669' }}>Active Specialists</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>TODAY'S APPOINTMENTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', margin: '6px 0' }}>
            {stats?.todayAppointments || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Scheduled for Today</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>CONFIRMED BOOKINGS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6366f1', margin: '6px 0' }}>
            {stats?.confirmedAppointments || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Completed: {stats?.completedAppointments || 0} | Cancelled: {stats?.cancelledAppointments || 0}
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      {stats?.departmentBreakdown && Object.keys(stats.departmentBreakdown).length > 0 && (
        <div className="card" style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>Appointments by Department</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {Object.entries(stats.departmentBreakdown).map(([dept, count]) => (
              <div key={dept} style={{
                backgroundColor: '#f1f5f9',
                padding: '10px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{dept}</span>
                <span style={{
                  backgroundColor: '#0284c7',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {count} bookings
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Master Hospital Appointments Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>All Hospital Appointments</h3>
          <button className="btn btn-outline btn-sm" onClick={loadAdminData}>
            Refresh Master List
          </button>
        </div>

        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No appointments recorded yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '10px 12px' }}>ID</th>
                  <th style={{ padding: '10px 12px' }}>Patient</th>
                  <th style={{ padding: '10px 12px' }}>Doctor</th>
                  <th style={{ padding: '10px 12px' }}>Department</th>
                  <th style={{ padding: '10px 12px' }}>Date & Time</th>
                  <th style={{ padding: '10px 12px' }}>Queue #</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>#{app.id}</td>
                    <td style={{ padding: '10px 12px' }}>{app.patient?.name}</td>
                    <td style={{ padding: '10px 12px' }}>{app.doctor?.name}</td>
                    <td style={{ padding: '10px 12px', color: '#0284c7' }}>{app.doctor?.department?.name || 'General'}</td>
                    <td style={{ padding: '10px 12px' }}>{app.appointmentDate} at {app.appointmentTime}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700 }}>#{app.queueNumber}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className={`badge badge-${app.status?.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
