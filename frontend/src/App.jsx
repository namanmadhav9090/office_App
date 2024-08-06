import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import './App.css'
import SignUp from './pages/auth/Signup';
import NotFoundPage from './pages/NotFound';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import DepartmentTable from './pages/Departments';
import Cookies from 'js-cookie';
import ProtectedRoute from './components/ProtectedRoute';

function App() {


  return (
    <>
     <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      
        <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for 404 errors */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        
      </Routes>
    </>
  )
}

export default App
