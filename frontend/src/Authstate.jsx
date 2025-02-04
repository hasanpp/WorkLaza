/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState({
    isAuthenticated: false,
    role: null,
    firstName: "",
    lastName: "",
    username: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole({
          ...userRole,
          isAuthenticated: true,
          role: decoded.is_admin ? 'admin' : decoded.is_worker ? 'worker' : 'user',
          firstName: localStorage.getItem('first_name'),
          lastName: localStorage.getItem('last_name'),
          username: localStorage.getItem('Username'),
        });
      } catch (error) {
        console.error("Invalid token:", error);
        setUserRole({ isAuthenticated: true, role: null });
      }
    }
  }, []);

  const login = (accessToken, refreshToken, userData) => {
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);
    localStorage.setItem('first_name', userData.first_name);
    localStorage.setItem('last_name', userData.last_name);
    localStorage.setItem('Username', userData.Username);
    try {
      const decoded = jwtDecode(accessToken);
      setUserRole({
        isAuthenticated: true,
        role: decoded.is_admin ? 'admin' : decoded.is_worker ? 'worker' : 'user',
        firstName: userData.first_name,
        lastName: userData.last_name,
        username: userData.Username,
      });
  
    } catch (error) {
      console.error("Token decode error:", error);
      setUserRole({ isAuthenticated: false, role: null });
    }
  };

  const logout = () => {
    localStorage.clear();
    setUserRole({ isAuthenticated: false, role: null });
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
