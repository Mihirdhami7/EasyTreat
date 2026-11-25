# 🏥 EasyTreat — Hospital Management System

EasyTreat is a web app that runs the daily work of one or more hospitals in one place: booking appointments, writing prescriptions, selling medicines, keeping stock, ordering from suppliers and taking payments.

Every person logs in with their own role and only sees what belongs to their work and their hospital.

---

## ✨ What each role can do

### 👤 Patient
- Sign up for a hospital, verify the email with a one-time code
- Book an appointment: pick a department, doctor, date and time slot
- Pay the booking fee online (Razorpay)
- Follow each appointment's status: pending → approved → completed
- See and download prescriptions as PDF
- Browse common diseases and their departments

### 🩺 Doctor
- See their appointments for the day and the coming days
- Approve, reschedule or reject a request
- Write a prescription with medicines from the hospital pharmacy; the patient gets it by email as a PDF
- Ask the pharmacy to add a medicine that is not in stock yet

### 🧑‍💼 Hospital Admin
- **Reception:** register walk-in patients, book visits, approve or reschedule requests, take the fee in cash or online
- **Give Medicine:** open a patient's prescription, bill the medicines, and stock is reduced automatically
- **Products:** manage pharmacy stock, review new products from suppliers, order from suppliers
- **Departments:** add departments, assign doctors and choose a head of department
- **Dashboard:** appointments, revenue and stock at a glance

### 🚚 Supplier
- Sign up, or be added by the super admin; uploads a company licence (PDF)
- Add products; a hospital admin approves them before they can be ordered
- Receive purchase orders from hospitals and fulfil them (quantity, price and expiry per product)
- Track which orders are waiting for payment and which are paid

### 🛡️ Super Admin (platform owner)
- **Dashboard:** numbers for all hospitals together or one at a time
- **Hospitals:** add or remove hospitals and create hospital admins. The admin gets an email to set their own password
- **Suppliers:** add, edit or remove suppliers and see their orders
- **Finance:** income from bookings, pharmacy and supplier orders per period
- **Settings, saved in the database (no code change needed):**
  - booking fee
  - Razorpay keys
  - the Gmail account that sends all emails
  - which notifications and emails are switched on

### 🔒 For everyone
- Secure login with a server session in an httpOnly cookie. Nothing is stored in the browser's localStorage. One login per browser; sessions end after 4 hours.
- Forgot password and set password by email
- Live notifications in the header
- Light and dark mode
- Profile page with photo

---

## 🛠️ Tech stack

| Part | Technology | What it is used for |
|---|---|---|
| Frontend | **React 18** + **Vite 6** | The user interface; Vite runs the dev server and builds the site |
| Styling | **Tailwind CSS 3** | Layout, colours and dark mode |
| UI parts | **Ant Design** (date picker), **React Icons**, **Lucide** | Date fields and icons |
| Charts | **Recharts** | Dashboard and finance charts |
| Routing | **React Router 7** | Pages and role-protected routes |
| HTTP | **Axios** | Calls to the backend API (sends the session cookie) |
| PDF | **jsPDF** (browser), **fpdf2** (server) | Prescription and bill PDFs |
| Backend | **Python** + **Django 4.2** + **Django REST Framework** | The REST API and all business rules |
| Database | **MongoDB Atlas** via **PyMongo** | Users, appointments, products, orders, payments, settings |
| Auth | **bcrypt** + **PyJWT** | Password hashing and signed session tokens |
| Payments | **Razorpay** | Online booking fees and supplier order payments |
| Email | **Gmail SMTP** (App Password) | OTP codes, invitations, prescriptions, receipts |
| Run | **Docker** + **Docker Compose** | Runs the backend the same way on every machine |

---

## 🚀 Run it on your computer

### 1. What you need
- [Git](https://git-scm.com/downloads)
- [Node.js 18 or newer](https://nodejs.org/), which includes npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster: its username, password, cluster address and a database name
  - In Atlas → **Network Access**, allow your IP address

### 2. Download the project
```bash
git clone https://github.com/Mihirdhami7/HMS-Major-Project.git
cd HMS-Major-Project
```

### 3. Backend settings
Create the file `Backend/.env`. It holds secrets and is never committed to git.

```env
# Django
SECRET_KEY=paste-a-long-random-value-here
DEBUG=1
ALLOWED_HOSTS=*
FRONTEND_URL=http://localhost:5173

# MongoDB Atlas
MONGO_USERNAME=your-db-user
MONGO_PASSWORD=your-db-password
MONGO_CLUSTER=cluster0.xxxxx.mongodb.net
MONGO_DATABASE=your-db-name
```

To make a `SECRET_KEY`:
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

> Razorpay keys, the booking fee and the email account are **not** set here. You enter them on the Super Admin → Settings page, and they are saved in the database.

### 4. Start the backend
```bash
cd Backend
docker compose up --build
```
The API runs at **http://localhost:8000**. Leave this terminal open.

### 5. Start the frontend
Open a second terminal:
```bash
cd frontend
cp .env.example .env    # Windows PowerShell: copy .env.example .env
npm install
npm run dev
```
The site opens at **http://localhost:5173**.

In development, Vite forwards `/api` and `/media` to the backend, so the login cookie works without extra setup.

### 6. Create the first Super Admin (one time only)
The super admin cannot sign up from the website. Create the account once from the backend container. Change the email, name and password first:

```bash
docker exec -it hms_backend python manage.py shell -c "
import bcrypt; from datetime import datetime, timezone; from backend.db import users_collection
users_collection.insert_one({'email': 'you@example.com', 'name': 'Your Name', 'userType': 'SuperAdmin', 'is_active': True,
  'hpassword': bcrypt.hashpw(b'YourStrongPassword', bcrypt.gensalt()).decode(), 'created_at': datetime.now(timezone.utc)})"
```

Then log in at **http://localhost:5173/superadmin/login**.

### 7. Set up the platform (in the website)
As the super admin:
1. **Settings** → enter the **Gmail address** and its **App Password**, so the site can send emails.
   - Create one in Google Account → Security → 2-Step Verification → App passwords.
2. **Settings** → enter the **Razorpay Key ID and Secret** and press *Test keys*.
   - Use `rzp_test_...` keys while testing.
3. **Settings** → set the **booking fee**.
4. **Hospitals** → add a hospital, then **Add admin**. The admin receives an email to set a password.
5. The hospital admin adds departments. Doctors and patients can then sign up at `/register` for that hospital.

---

## 🧰 Useful commands

| Where | Command | What it does |
|---|---|---|
| `frontend/` | `npm run dev` | Start the site with live reload |
| `frontend/` | `npm run build` | Build the production site into `frontend/dist` |
| `frontend/` | `npm run lint` | Check the code for mistakes |
| `Backend/` | `docker compose up` | Start the API |
| `Backend/` | `docker compose down` | Stop the API |
| `Backend/` | `docker compose logs -f` | Watch the API logs |

---

## 🔐 Good to know
- Never commit `Backend/.env` or `frontend/.env`; both are in `.gitignore`.
- Use Razorpay **test** keys until you are ready to take real payments.
- Each hospital's data is kept apart. An admin, doctor or patient only sees their own hospital. A patient can register the same email at another hospital as a separate account.

---

## 🌐 Deployment (planned)
- **Frontend:** Vercel (`easytreat.vercel.app`)
- **Backend:** AWS EC2 with Docker, behind HTTPS
- **Uploaded files:** AWS S3
- **Database:** MongoDB Atlas (already in the cloud)

Step-by-step deployment notes will be added here once it is live.

---

## 👨‍💻 Author
**Mihir Dhami** — [GitHub](https://github.com/Mihirdhami7) · [Portfolio](https://mihirdhami7.vercel.app)
