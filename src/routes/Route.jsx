import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUpPage from '../pages/signup/SignUpPage';
import LoginPage from '../pages/login/LoginPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
}