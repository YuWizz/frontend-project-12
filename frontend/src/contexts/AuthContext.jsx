import React, {
    createContext,
    useState,
    useContext,
    useMemo,
    useEffect,
  } from 'react';
import axios from 'axios';

const localStorageKeys = {
    token: 'chatToken',
    user: 'chatUser',
};

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const initialToken = localStorage.getItem(localStorageKeys.token);
    const initialUser = JSON.parse(localStorage.getItem(localStorageKeys.user));

    const [token, setToken] = useState(initialToken);
    const [user, setUser] = useState(initialUser);

    const [loggedIn, setLoggedIn] = useState(!!initialToken);

    const logIn = async (authData) => {
        try {
          const response = await axios.post('/api/v1/login', authData);
          const { token: receivedToken, username } = response.data;
    
          localStorage.setItem(localStorageKeys.token, receivedToken);
          const userData = { username };
          localStorage.setItem(localStorageKeys.user, JSON.stringify(userData));
    
          setToken(receivedToken);
          setUser(userData);
          setLoggedIn(true);
    
          return userData;
        } catch (error) {
          console.error('Ошибка авторизации:', error);
          logOut();
          throw error;
        }
      };

    const logOut = () => {
        localStorage.removeItem(localStorageKeys.token);
        localStorage.removeItem(localStorageKeys.user);
    
        setToken(null);
        setUser(null);
        setLoggedIn(false);
    };

    const contextValue = useMemo(
        () => ({
          loggedIn,
          logIn,
          logOut,
          user,
          token,
        }),
        [loggedIn, user, token],
    );

    return (
      <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
