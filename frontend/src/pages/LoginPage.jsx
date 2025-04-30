import React from 'react'
import { Link } from 'react-router-dom'
import routes from '../routes.js'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import LoginForm from '../components/LoginForm.jsx'
import { useTranslation } from 'react-i18next'

const LoginPage = () => {
  const { t } = useTranslation()

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
              </div>
              <div className="col-12 col-md-6">
                <h1 className="text-center mb-4">{t('login.title')}</h1>
                <LoginForm />
              </div>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('login.noAccount')}</span>{' '}
                <Link to={routes.signupPath()}>{t('login.signupLink')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage
