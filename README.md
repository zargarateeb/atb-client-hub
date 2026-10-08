# ATB Client Hub

A full-stack client management portal built for **ATB Visuals** to manage projects, communication, files, and deliveries in one place.

🔗 **Live Demo:** https://atb-client-hub.vercel.app

---

## 🚀 Features

- 🔐 Client & Admin authentication
- 📊 Project-based dashboard
- 💬 Project-based messaging
- 📁 File uploads and downloads
- 🔔 Web push notifications
- 📱 Progressive Web App (PWA)
- 🛠️ Dedicated admin dashboard
- 📈 Activity tracking
- 📱 Responsive, mobile-first interface
- 👥 Role-based access control

---

## 🧰 Tech Stack

### Frontend
- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend & Database
- Next.js API Routes
- MongoDB
- Mongoose
- NextAuth.js

### Services
- Cloudinary
- Web Push
- Vercel

---

## 🏗️ Architecture

The application is built using the **Next.js App Router** with backend functionality handled through API routes.

```text
Client
  ↓
Next.js Application
  ↓
API Routes
  ↓
MongoDB + Mongoose
  ↓
Cloudinary / Web Push
