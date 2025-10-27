# 🏥 Hospital Management System - MVCS Architecture

A comprehensive hospital management system built with **Node.js**, **MySQL**, and **React** following the **MVCS (Model-View-Controller-Service)** architecture pattern.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Features Detail](#features-detail)

## ✨ Features

### General Features
- 🔐 **Secure Authentication** - JWT-based authentication for all user roles
- 👤 **Multi-Role System** - Patient, Doctor, and Admin dashboards
- 💊 **Medicine Inventory** - Complete medicine management with prices and stock
- 📅 **Appointment Booking** - Easy appointment scheduling with doctor selection
- 💳 **Billing System** - Integrated billing with medicine costs
- 📋 **Medical Records** - Patient history and medical records
- 🏥 **Ward Management** - Hospital ward allocation and tracking

### Patient Features
- ✅ Book appointments with specialized doctors
- ✅ View appointment history
- ✅ Browse medicine inventory with prices
- ✅ View "My Doctors" - doctors they've visited
- ✅ Check billing and payments
- ✅ View medical records
- ✅ Search and filter medicines by category

### Doctor Features
- ✅ View patient appointments with patient details
- ✅ Manage patient list with visit counts
- ✅ Medical records management
- ✅ Ward assignment and management
- ✅ Profile settings
- ✅ Dashboard with statistics

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment configuration

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

## 🏗 Architecture

This project follows the **MVCS (Model-View-Controller-Service)** architecture:

```
┌─────────────────────────────────────────────────┐
│                   CLIENT                         │
│              (React Frontend)                    │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                   CONTROLLERS                   │
│         (Route Handlers - Express)              │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                    SERVICES                      │
│         (Business Logic Layer)                  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                    MODELS                        │
│         (Data Access Layer)                      │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                   DATABASE                       │
│                    (MySQL)                       │
└─────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
hospital-management-system-MVCS-architecture-
├── backend/
│   ├── config/
│   │   └── db.js                  # Database connection
│   ├── controllers/
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── medicineController.js
│   │   └── patientController.js
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication
│   │   └── verifyToken.js
│   ├── models/
│   │   ├── appointmentModel.js
│   │   ├── doctorModel.js
│   │   ├── medicineModel.js
│   │   └── patientModel.js
│   ├── routes/
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── medicineRoutes.js
│   │   └── patientRoutes.js
│   ├── services/
│   │   ├── appointmentService.js
│   │   ├── authService.js
│   │   ├── doctorService.js
│   │   └── medicineService.js
│   ├── server.js                  # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Appointments.js
│   │   │   ├── Doctors.js
│   │   │   └── MedicalRecords.js
│   │   ├── pages/
│   │   │   ├── Admin.js
│   │   │   ├── Doctor.js
│   │   │   ├── DoctorsList.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   └── Patient.js
│   │   ├── api.js                  # API configuration
│   │   └── App.js
│   └── package.json
│
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/PariGarg10/hospital-management-system-MVCS-architecture-.git
   cd hospital-management-system-MVCS-architecture-
   ```

2. **Install dependencies**

   Backend:
   ```bash
   cd backend
   npm install
   ```

   Frontend:
   ```bash
   cd ../frontend
   npm install
   ```

## 🗄 Database Setup

1. **Create MySQL database**
   ```sql
   CREATE DATABASE hospitaldb;
   ```

2. **Create `.env` file in backend directory**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=hospitaldb
   DB_PORT=3306
   PORT=5000
   JWT_SECRET=your_secret_key
   ```

3. **Setup database tables**
   ```bash
   cd backend
   node createMedicineTable.js
   ```

## ▶️ Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

### Start Frontend Server
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/patient` - Patient registration
- `POST /api/auth/register/doctor` - Doctor registration
- `POST /api/auth/login` - User login

### Appointments
- `POST /api/appointments/book` - Book appointment (Patient)
- `GET /api/appointments/patient/my` - Get patient appointments
- `GET /api/appointments/doctor/my` - Get doctor appointments

### Doctors
- `GET /api/doctors` - Get all doctors

### Medicines
- `GET /api/medicines` - Get all medicines with prices

### Wards
- `GET /api/wards` - Get all wards

## 👥 User Roles

### 👤 Patient
- Register and login
- Book appointments with doctors
- View appointment history
- Browse medicine inventory
- View "My Doctors" list
- Check billing and payments
- View medical records

### 👨‍⚕ Doctor
- Register and login
- View patient appointments
- Manage patient list
- Access medical records
- Manage wards
- Profile settings

### 👨‍💼 Admin
- Manage all users
- View all appointments
- Manage wards
- System administration

## 🎯 Features Detail

### Medicine Inventory
- ✅ 15+ medicines with real prices (₹25 - ₹150)
- ✅ Categorized (Pain Relief, Antibiotic, Cough & Cold, etc.)
- ✅ Search and filter functionality
- ✅ Stock management
- ✅ Integrated with billing system

### Appointment System
- ✅ Book appointments with problem-based doctor selection
- ✅ Specialization-based filtering
- ✅ Doctor-patient bidirectional data flow
- ✅ Appointment history for both parties
- ✅ Status tracking (Scheduled, Confirmed, Pending, Completed)

### Doctor-Patient Connection
- ✅ Doctors see patient names and details
- ✅ Patients see their visiting doctors
- ✅ Visit count tracking
- ✅ Last visit date

### Billing System
- ✅ Consultation fees
- ✅ Medicine costs calculation
- ✅ Total due amount
- ✅ Payment status tracking

## 🔐 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Secure API endpoints

## 📊 Database Schema

### Tables
- `Patient` - Patient information
- `Doctor` - Doctor information
- `Appointment` - Appointment records
- `Medicine` - Medicine inventory
- `Billing` - Billing records
- `Ward` - Ward management

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License.

## 👨‍💻 Author
**Puniti Jodhwani**
**Pari Garg**

