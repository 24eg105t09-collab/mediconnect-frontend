import React, { useState, useEffect } from 'react';
import { doctorApi, departmentApi } from '../api';
import { Search, Calendar, Stethoscope, Star, Award, MapPin } from 'lucide-react';

export default function DoctorFinder({ onSelectDoctor, onOpenChatbot }) {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docsRes, deptsRes] = await Promise.all([
        doctorApi.getAll(),
        departmentApi.getAll()
      ]);
      setDoctors(docsRes.data);
      setDepartments(deptsRes.data);
    } catch (err) {
      console.error("Error loading doctors/departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await doctorApi.search(searchQuery);
      setDoctors(res.data);
    } catch (err) {
      console.error("Error searching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    if (selectedDept === 'ALL') return true;
    return doc.department?.id === selectedDept || doc.department?.name === selectedDept;
  });

  return (
    <div className="container">
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
        borderRadius: '16px',
        padding: '36px 32px',
        color: '#fff',
        marginBottom: '28px',
        boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <span style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Smart Healthcare
          </span>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, marginTop: '8px', lineHeight: 1.2 }}>
            Find Expert Doctors & Live Available Slots
          </h1>
          <p style={{ opacity: 0.9, marginTop: '6px', fontSize: '1rem' }}>
            Browse certified hospital specialists or use our AI Assistant to find doctors and book appointments in seconds.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', maxWidth: '600px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search by doctor name (e.g. Dr. Ananya) or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '8px',
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem',
                color: '#0f172a'
              }}
            />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ backgroundColor: '#0f766e' }}>
            Search
          </button>
        </form>
      </div>

      {/* Department Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        <button
          className={`btn btn-sm ${selectedDept === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedDept('ALL')}
        >
          All Departments
        </button>
        {departments.map(dept => (
          <button
            key={dept.id}
            className={`btn btn-sm ${selectedDept === dept.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedDept(dept.id)}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Loading certified hospital doctors...
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No doctors found matching your criteria.</h3>
          <p style={{ color: '#64748b', marginTop: '6px' }}>Try searching another department or ask the AI Chatbot!</p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={onOpenChatbot}>
            Ask AI Assistant
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredDoctors.map(doc => (
            <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.2rem'
                  }}>
                    {doc.name.replace('Dr. ', '').charAt(0)}
                  </div>
                  <span className="badge badge-confirmed">
                    Active & Available
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{doc.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600, marginBottom: '6px' }}>
                  {doc.specialization}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
                  {doc.department ? doc.department.name : 'General Department'} • {doc.qualifications || 'MBBS'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#475569', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={14} color="#0284c7" /> {doc.experienceYears || 5}+ years clinical experience
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#0d9488" /> Room: {doc.roomNumber || '101'}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Consultation Fee</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>₹{doc.consultationFee || 500}</div>
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => onSelectDoctor(doc)}
                >
                  <Calendar size={14} /> Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
