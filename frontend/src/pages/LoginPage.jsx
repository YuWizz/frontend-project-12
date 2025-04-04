import React from 'react';
import LoginForm from '../components/LoginForm.jsx';

const LoginPage = () => {
  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h1>Войти</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
