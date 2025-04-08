import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

const API_PATH = '/api/v1/messages';
const AUTH_TOKEN_KEY = 'chatToken';

const MessageForm = ({ channelId }) => {
  const { user } = useAuth();
  const [sendError, setSendError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [channelId]);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSendError(null);
      setSubmitting(true);

      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token || !user) {
        setSendError('Ошибка: Вы не авторизованы.');
        setSubmitting(false);
        return;
      }

      const newMessage = {
        body: values.body,
        channelId: channelId,
        username: user.username,
      };

      try {
        await axios.post(API_PATH, newMessage, {
          headers: { Authorization: `Bearer ${token}` },
        });
        resetForm();

      } catch (error) {
        setSubmitting(false);
        console.error('Failed to send message:', error);
        if (error.code === 'ECONNABORTED') {
           setSendError('Не удалось отправить сообщение. Время ожидания истекло.');
        } else if (error.response) {
           setSendError(`Ошибка отправки: ${error.response.statusText || error.message}`);
        } else if (error.request) {
           setSendError('Не удалось отправить сообщение. Проверьте сеть.');
        } else {
           setSendError('Произошла ошибка при отправке сообщения.');
        }
      } finally {
         setTimeout(() => {
           setSubmitting(false);
           inputRef.current?.focus();
         }, 100);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
      <InputGroup hasValidation>
        <Form.Control
          ref={inputRef}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.body}
          name="body"
          aria-label="Новое сообщение"
          placeholder="Введите сообщение..."
          className="border-0 p-0 ps-2"
          required
          disabled={formik.isSubmitting}
          isInvalid={!!sendError}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={formik.isSubmitting || !formik.values.body}
          className="border-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path></svg>
          <span className="visually-hidden">Отправить</span>
        </Button>
        {sendError && <Form.Control.Feedback type="invalid" tooltip>{sendError}</Form.Control.Feedback>}
      </InputGroup>
    </Form>
  );
};

export default MessageForm;
