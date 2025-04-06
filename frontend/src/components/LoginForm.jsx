import React, { useState } from 'react';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const initialValues = {
    username: '',
    password: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError(null);
    try {
      await auth.logIn(values);
      navigate('/');
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response && error.response.status === 401) {
        setLoginError('Неверные имя пользователя или пароль');
        console.log(error);
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues} onSubmit={handleSubmit}>
      {({
        handleSubmit: formikSubmit,
        handleChange,
        values,
        touched,
        errors, 
        isSubmitting, 
      }) => (
        <Form onSubmit={formikSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Ваш ник</Form.Label>
            <Form.Control
              type="text"
              onChange={handleChange}
              value={values.username}
              name="username"
              isInvalid={touched.username && !!loginError}
              required
              disabled={isSubmitting}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              onChange={handleChange}
              value={values.password}
              name="password"
              isInvalid={!!loginError}
              required
              disabled={isSubmitting}
            />
            <Form.Control.Feedback type="invalid" style={{ display: loginError ? 'block' : 'none' }}>
              {loginError || 'Неверные данные'}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
