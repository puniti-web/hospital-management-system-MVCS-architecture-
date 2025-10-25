
## 🏥 Hospital Management System 

A complete MERN-style hospital management system built using **Node.js, Express, MySQL, and React**.
It provides secure role-based login for doctors and patients, appointment management, and ward assignment — all connected to a live MySQL database.

---

### 📁 Project Structure

```
hospital-management-system/
├── backend/
│   ├── server.js                # Main backend entry point
│   ├── db.js                    # MySQL database connection
│   ├── routes/
│   │   ├── authRoutes.js        # Login / Register APIs
│   │   ├── appointmentRoutes.js # Appointment booking APIs
│   │   └── wardRoutes.js        # Ward assignment (doctor/admin)
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── .env                     # (ignored) Environment variables
│   └── .env.example             # Safe sample environment file
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React UI components
│   │   ├── pages/               # Login, Dashboard pages
│   │   ├── App.js               # Main routing logic
│   │   └── index.js             # React root render
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Features

✅ **Authentication (JWT-based)**
→ Separate login for Doctors and Patients
→ Passwords hashed with **bcrypt**

✅ **MySQL Database Integration**
→ All user and appointment data is persistent and queryable

✅ **Role-Based Access Control**
→ Patients can book appointments
→ Doctors can view and manage their schedules
→ Admin can assign wards

✅ **React Frontend (localhost:3000)**
→ Clean UI for login and dashboards

✅ **RESTful API Architecture**
→ Follows clean MVC folder structure

---

## 🧩 Tech Stack

| Layer        | Technology                   |
| ------------ | ---------------------------- |
| **Frontend** | React.js (Vite or CRA)       |
| **Backend**  | Node.js, Express             |
| **Database** | MySQL                        |
| **Auth**     | JWT (jsonwebtoken), bcryptjs |
| **Testing**  | curl or Postman              |

---

## 🧠 Environment Setup

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hospitaldb
JWT_SECRET=secret
PORT=5000
```

Then start the server:

```bash
node server.js
```

It should print:

```
Server running on port 5000
Connected to MySQL
```

---

### 2️⃣ MySQL Setup

1. Open **MySQL Workbench**

2. Create database:

   ```sql
   CREATE DATABASE hospitaldb;
   USE hospitaldb;
   ```

3. Create required tables:

   ```sql
   CREATE TABLE Doctor (
     DoctorID INT AUTO_INCREMENT PRIMARY KEY,
     Name VARCHAR(100),
     Specialization VARCHAR(100),
     Contact VARCHAR(15),
     Email VARCHAR(100),
     Password VARCHAR(255)
   );

   CREATE TABLE Patient (
     PatientID INT AUTO_INCREMENT PRIMARY KEY,
     Name VARCHAR(100),
     Age INT,
     Gender VARCHAR(10),
     Contact VARCHAR(15),
     Address VARCHAR(255),
     Email VARCHAR(100),
     Password VARCHAR(255)
   );

   CREATE TABLE Appointment (
     AppointmentID INT AUTO_INCREMENT PRIMARY KEY,
     PatientID INT,
     DoctorID INT,
     AppointmentDate DATE,
     StartTime TIME,
     EndTime TIME,
     Reason VARCHAR(255),
     Status VARCHAR(20),
     FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
     FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
   );

   CREATE TABLE Ward (
     WardID INT AUTO_INCREMENT PRIMARY KEY,
     WardName VARCHAR(50),
     Capacity INT,
     AssignedDoctor INT,
     FOREIGN KEY (AssignedDoctor) REFERENCES Doctor(DoctorID)
   );
   ```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Then visit 👉 [http://localhost:3000](http://localhost:3000)

---

## 🔐 API Usage Examples

### Register Doctor

```bash
curl.exe -X POST "http://localhost:5000/api/auth/register/doctor" ^
-H "Content-Type: application/json" ^
-d "{\"Name\":\"Dr. Meera Sharma\",\"Specialization\":\"Cardiology\",\"Contact\":\"9999999999\",\"Email\":\"doctor@example.com\",\"Password\":\"doctor123\"}"
```

### Register Patient

```bash
curl.exe -X POST "http://localhost:5000/api/auth/register/patient" ^
-H "Content-Type: application/json" ^
-d "{\"Name\":\"Aman Patel\",\"Email\":\"patient@example.com\",\"Password\":\"patient123\"}"
```

### Login

```bash
curl.exe -X POST "http://localhost:5000/api/auth/login" ^
-H "Content-Type: application/json" ^
-d "{\"role\":\"doctor\",\"emailOrContact\":\"doctor@example.com\",\"password\":\"doctor123\"}"
```

### Book Appointment

```bash
curl.exe -X POST "http://localhost:5000/api/appointments/book" ^
-H "Authorization: Bearer <patient_token>" ^
-H "Content-Type: application/json" ^
-d "{\"doctorId\":1,\"appointmentDate\":\"2025-10-20\",\"startTime\":\"10:00:00\",\"endTime\":\"10:30:00\",\"reason\":\"Fever\"}"
```

---

## 🧑‍💻 Role Flow

| Role                 | Capabilities                                         |
| -------------------- | ---------------------------------------------------- |
| **Patient**          | Register, login, view profile, book appointments     |
| **Doctor**           | Login, view appointments, manage patients, see wards |
| **Admin (optional)** | Assign doctors to wards                              |

---

## 🌍 Deployment (AWS EC2)

1. Launch an **Ubuntu EC2 Instance**
2. Install Node.js, MySQL:

   ```bash
   sudo apt update
   sudo apt install nodejs npm mysql-server
   ```
3. Clone your repo:

   ```bash
   git clone https://github.com/<your-username>/hospital-management-system.git
   ```
4. Configure `.env` with your MySQL details
5. Start backend:

   ```bash
   cd backend
   node server.js
   ```
6. Build frontend:

   ```bash
   cd frontend
   npm run build
   ```
7. Serve build using `serve` or `nginx`

---

## 🧾 License

This project is open-source and available under the **MIT License**.
