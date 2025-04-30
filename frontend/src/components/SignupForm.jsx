import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth.js'
import { useTranslation } from 'react-i18next'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import routes from '../routes.js'

const API_PATH = '/api/v1/signup'

const SignupForm = () => {
  const auth = useAuth()
  const navigate = useNavigate()
  const [signupError, setSignupError] = useState(null)
  const usernameInputRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    usernameInputRef.current?.focus()
  }, [])

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .trim()
      .required(t('errors.required'))
      .min(3, t('errors.usernameLength'))
      .max(20, t('errors.usernameLength')),
    password: Yup.string()
      .required(t('errors.required'))
      .min(6, t('errors.passwordLength')),
    confirmPassword: Yup.string()
      .required(t('errors.required'))
      .oneOf([Yup.ref('password'), null], t('errors.passwordsMustMatch')),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setSignupError(null)
      setSubmitting(true)
      const { username, password } = values

      try {
        const response = await axios.post(API_PATH, { username, password })
        localStorage.setItem('chatToken', response.data.token)
        localStorage.setItem('chatUser', JSON.stringify({ username: response.data.username }))
        await auth.logIn({ username, password })
        navigate(routes.chatPath())
      }
      catch (error) {
        setSubmitting(false)
        console.error('Signup failed:', error)
        if (error.isAxiosError && error.response) {
          if (error.response.status === 409) {
            setFieldError('username', t('errors.userExists'))
            usernameInputRef.current?.focus()
          }
          else {
            setSignupError(t('errors.connection'))
          }
        }
        else if (error.request) {
          setSignupError(t('errors.connection'))
        }
        else {
          setSignupError(t('errors.unknown'))
        }
      }
    },
  })

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>{t('signup.usernameLabel')}</Form.Label>
        <Form.Control
          ref={usernameInputRef}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          name="username"
          placeholder={t('signup.usernamePlaceholder')}
          isInvalid={formik.touched.username && !!formik.errors.username}
          required
          disabled={formik.isSubmitting}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.username}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>{t('signup.passwordLabel')}</Form.Label>
        <Form.Control
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          name="password"
          placeholder={t('signup.passwordPlaceholder')}
          isInvalid={!!formik.errors.password && formik.touched.password}
          required
          disabled={formik.isSubmitting}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4" controlId="confirmPassword">
        <Form.Label>{t('signup.confirmPasswordLabel')}</Form.Label>
        <Form.Control
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
          name="confirmPassword"
          placeholder={t('signup.confirmPasswordPlaceholder')}
          isInvalid={!!formik.errors.confirmPassword && formik.touched.confirmPassword}
          required
          disabled={formik.isSubmitting}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.confirmPassword}
        </Form.Control.Feedback>
      </Form.Group>
      {signupError && (
        <div className="alert alert-danger">{signupError}</div>
      )}

      <Button variant="outline-primary" type="submit" className="w-100" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? t('loading') : t('buttons.signup')}
      </Button>
    </Form>
  )
}

export default SignupForm
