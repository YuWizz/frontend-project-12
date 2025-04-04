import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const LoginForm = () => {
  const initialValues = {
    username: '',
    password: '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);

    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          
          <div>
            <label htmlFor="username">Ваш ник</label>
            <Field type="text" id="username" name="username" />
            <ErrorMessage name="username" component="div" style={{ color: 'red' }} />
          </div>

          <div>
            <label htmlFor="password">Пароль</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
          </div>

          <button type="submit" disabled={isSubmitting}>
            Войти
          </button>

        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
