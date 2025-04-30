import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth.js'
import routes from '../routes.js'

const PrivateRoute = ({ children }) => {
  const { loggedIn } = useAuth()

  return loggedIn ? children : <Navigate to={routes.loginPath()} replace />
}

export default PrivateRoute
