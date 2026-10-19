# 🏥 MediConnect AI — Frontend (React.js + Vite)

The modern, responsive web application for **MediConnect AI** (Hospital Management & Doctor Availability Assistant).

## 🛠️ Tech Stack
- **Framework:** React 19 + Vite
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Styling:** Modern responsive CSS with custom clinical theme

## 🌟 Modules & Features
- **🩺 Doctor Finder:** Search specialists by department, view qualifications, fees, room numbers, and live availability.
- **📅 Interactive Booking:** Calendar date picker with morning/afternoon/evening 30-min slot blocks, fee summary, and estimated wait-time preview.
- **🤖 AI Doctor Assistant:** Chatbot modal with symptom guidance, live MySQL slot lookup, and direct chat booking.
- **👥 Patient Portal:** Live queue position (#), estimated wait times, consultation history, and instant cancellation/slot release.
- **👨‍⚕️ Doctor Portal:** Live daily patient queue, consultation notes/prescriptions, and schedule overview.
- **🛡️ Admin Portal:** Operational stats (total patients, doctors, bookings, department breakdown) and master booking records.

## 🚀 Running the Frontend
Install dependencies and launch the Vite development server:

```bash
npm install
npm run dev
```

The application will be live at: **http://localhost:5173**

## 🔗 Connecting to the Backend
By default, the frontend sends requests to `http://localhost:8080/api` configured in `src/api.js`.
Ensure the Spring Boot backend is running.
