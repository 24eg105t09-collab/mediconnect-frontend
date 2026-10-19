import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const doctorApi = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  getByUserId: (userId) => api.get(`/doctors/user/${userId}`),
  search: (query) => api.get(`/doctors/search`, { params: { query } }),
  getByDepartment: (deptId) => api.get(`/doctors/department/${deptId}`),
  getSchedules: (doctorId) => api.get(`/doctors/${doctorId}/schedules`),
  addSchedule: (doctorId, schedule) => api.post(`/doctors/${doctorId}/schedules`, schedule),
  deleteSchedule: (scheduleId) => api.delete(`/doctors/schedules/${scheduleId}`),
};

export const departmentApi = {
  getAll: () => api.get('/departments'),
};

export const appointmentApi = {
  book: (appointmentData) => api.post('/appointments/book', appointmentData),
  getSlots: (doctorId, date) => api.get('/appointments/slots', { params: { doctorId, date } }),
  getPatientAppointments: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getDoctorAppointments: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  getDoctorTodayAppointments: (doctorId) => api.get(`/appointments/doctor/${doctorId}/today`),
  cancel: (appointmentId) => api.put(`/appointments/${appointmentId}/cancel`),
  updateStatus: (appointmentId, status, notes) => 
    api.put(`/appointments/${appointmentId}/status`, null, { params: { status, notes } }),
  getAll: () => api.get('/appointments/all'),
};

export const chatbotApi = {
  sendMessage: (payload) => api.post('/chatbot/message', payload),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  deactivateDoctor: (doctorId) => api.delete(`/admin/doctors/${doctorId}`),
};

export default api;
