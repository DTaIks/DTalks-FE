import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import SignUpPage from '../pages/signup/SignUpPage';
import UserListPage from '../pages/dashboard/UserListPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<UserListPage />} />
    </Routes>
  );
}