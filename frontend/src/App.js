import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Doctor from "./pages/Doctor";
import Patient from "./pages/Patient";
import Admin from "./pages/Admin";
import DoctorsList from "./pages/DoctorsList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/doctors" element={<DoctorsList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
