import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './contexts/useAuth.js'
import routes from './routes.js'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import ModalRoot from './components/ModalRoot.jsx'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import ChatPage from './pages/ChatPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import './App.css'

function App() {
  const { loggedIn, logOut, user } = useAuth()
  const { t } = useTranslation()

  return (
    <div className="d-flex flex-column h-100">
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to={routes.chatPath()}>Hexlet Chat</Navbar.Brand>
          {loggedIn && (
            <div className="ms-auto">
              {user && <span className="me-3">{t('navbar.loggedInAs', { username: user.username })}</span>}
              <Button variant="primary" onClick={logOut}>{t('buttons.logout')}</Button>
            </div>
          )}
        </Container>
      </Navbar>
      <Container fluid className="h-100 flex-grow-1 overflow-auto">
        <Routes>
          <Route path={routes.chatPath()} element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path={routes.loginPath()} element={loggedIn ? <Navigate to={routes.chatPath()} replace /> : <LoginPage />} />
          <Route path={routes.signupPath()} element={loggedIn ? <Navigate to={routes.chatPath()} replace /> : <SignupPage />} />
          <Route path={routes.notFoundPath()} element={<NotFoundPage />} />
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
      <ModalRoot />
    </div>
  )
}

export default App
