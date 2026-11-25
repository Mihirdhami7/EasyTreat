# 🏥 EasyTreat — Hospital Management System

EasyTreat runs the daily work of one or more hospitals in one place: booking appointments, writing prescriptions, selling medicines, keeping stock, ordering from suppliers and taking payments.

Every person logs in with their own role and only sees what belongs to their work and their hospital.

---

## ✨ Features

### 👤 Patient
- Sign up for a hospital and verify the email
- Book an appointment with a department, doctor, date and time slot
- Pay the booking fee online
- View and download prescriptions as PDF
- Browse common diseases and the right department for them

### 🩺 Doctor
- See upcoming appointments
- Approve, reschedule or reject requests
- Write prescriptions; the patient receives them by email
- Request new medicines from the hospital pharmacy

### 🧑‍💼 Hospital Admin
- **Reception:** register walk-in patients, book visits, and take fees in cash or online
- **Give Medicine:** bill prescribed medicines; stock updates automatically
- **Products:** manage pharmacy stock, approve supplier products, and place orders
- **Departments:** add departments, assign doctors and choose a head
- **Dashboard:** appointments, revenue and stock at a glance

### 🚚 Supplier
- Sign up with a company licence
- Add products for hospitals to order
- Receive and fulfil hospital orders
- Track pending and paid orders

### 🛡️ Super Admin
- **Dashboard:** see the performance of all hospitals together, or of one hospital at a time
- **Hospitals:** add hospitals and their admins; each admin gets an email to set a password
- **Suppliers:** add, edit or remove suppliers
- **Finance:** income from bookings, the pharmacy and supplier orders
- **Settings:** change the booking fee, payment and email setup, and notifications directly from the website

---

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Ant Design

**Backend**
- Python
- Django REST Framework
- MongoDB Atlas

**Services**
- Razorpay (payments)
- Gmail (emails)
- Docker

---

## 🚀 How to Run

### Requirements
- [Git](https://git-scm.com/downloads)
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database

### 1. Download
```bash
git clone https://github.com/Mihirdhami7/HMS-Major-Project.git
cd HMS-Major-Project
```

### 2. Backend
Create `Backend/.env`:
```env
SECRET_KEY=your-secret-key
DEBUG=1
ALLOWED_HOSTS=*
FRONTEND_URL=http://localhost:5173

MONGO_USERNAME=your-db-user
MONGO_PASSWORD=your-db-password
MONGO_CLUSTER=cluster0.xxxxx.mongodb.net
MONGO_DATABASE=your-db-name
```

Start it:
```bash
cd Backend
docker compose up --build
```
The backend runs at **http://localhost:8000**.

### 3. Frontend
In a new terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open **http://localhost:5173**.

### 4. Create the Super Admin (first time only)
Replace the email, name and password, then run:
```bash
docker exec -it hms_backend python manage.py shell -c "
import bcrypt; from datetime import datetime, timezone; from backend.db import users_collection
users_collection.insert_one({'email': 'you@example.com', 'name': 'Your Name', 'userType': 'SuperAdmin', 'is_active': True,
  'hpassword': bcrypt.hashpw(b'YourPassword', bcrypt.gensalt()).decode(), 'created_at': datetime.now(timezone.utc)})"
```
Log in at **http://localhost:5173/superadmin/login**. In **Settings**, add the Gmail and Razorpay details. Then add a hospital and its admin from **Hospitals**.

---

## 👨‍💻 Author
**Mihir Dhami** — [GitHub](https://github.com/Mihirdhami7) · [Portfolio](https://mihirdhami7.vercel.app)
