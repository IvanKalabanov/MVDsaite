// src/AppRoutes.jsx (обновляем)
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile'; // ← добавляем
import News from './pages/News';
import Leadership from './pages/Leadership';
import Applications from './pages/Applications';
import Database from './pages/Database';
import Employees from './pages/Employees';
import Admin from './pages/Admin';
import RoleProtected from './components/Layout/RoleProtected';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} /> {/* ← добавляем */}
      <Route path="/news" element={<News />} />
      <Route path="/leadership" element={<Leadership />} />
      <Route path="/applications" element={<Applications />} />
      <Route 
        path="/database" 
        element={
          <RoleProtected requiredRole="employee">
            <Database />
          </RoleProtected>
        } 
      />
      <Route 
        path="/employees" 
        element={
          <RoleProtected requiredRole="employee">
            <Employees />
          </RoleProtected>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <RoleProtected requiredRole="admin">
            <Admin />
          </RoleProtected>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;