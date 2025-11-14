// src/App.jsx
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import AppRoutes from './AppRoutes';
import LoginForm from './components/Auth/LoginForm';
import './styles/App.css';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="app">
      <Header />
      <Navigation />
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;