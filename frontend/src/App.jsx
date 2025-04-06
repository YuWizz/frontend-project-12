import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import './App.css';

function App() {
  const { loggedIn } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
        <PrivateRoute>
          <ChatPage />
        </PrivateRoute>
        } 
      />

      <Route 
        path="/login" 
        element={loggedIn ? <Navigate to="/" replace /> : <LoginPage />} 
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App
