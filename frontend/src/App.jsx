import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import './App.css';

function App() {
  const { loggedIn, logOut, user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column h-100">
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
          {loggedIn && (
             <div className='ms-auto'>
               {user && <span className="me-3">{t('navbar.loggedInAs', { username: user.username })}</span>}
              <Button variant="primary" onClick={logOut}>{t('buttons.logout')}</Button>
             </div>
          )}
        </Container>
      </Navbar>
      <Container fluid className="h-100 flex-grow-1 overflow-auto">
        <Routes>
          <Route path="/" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/login" element={loggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/signup" element={loggedIn ? <Navigate to="/" replace /> : <SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App
