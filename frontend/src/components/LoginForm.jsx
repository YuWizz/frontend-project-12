import React, { useState } from 'react';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../contexts/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const { t } = useTranslation();

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
        setLoginError(t('errors.invalidCredentials'));
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
        isSubmitting, 
      }) => (
        <Form onSubmit={formikSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>{t('login.usernameLabel')}</Form.Label>
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
            <Form.Label>{t('login.passwordLabel')}</Form.Label>
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
              {loginError}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('loading') : t('buttons.login')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
