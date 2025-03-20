import { createContext, useState, useEffect } from "react";
import config from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn ] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [c_user, c_setUser] = useState(localStorage.getItem("user") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [c_password, c_setPassword] = useState(localStorage.getItem("pwd") || null);

  useEffect(() => {
    console.log("c_user has changed to ", c_user)
    if (c_user) {
      localStorage.setItem("user", c_user); // Persist to localStorage
    } else {
      localStorage.removeItem("user");
    }
  }, [c_user]);
  useEffect(() => {
    console.log("token has changed to ", token)

    if (token) {
      localStorage.setItem("token", token); // Persist to localStorage
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    console.log("refreshToken has changed to ", refreshToken)

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken); // Persist to localStorage
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);
  useEffect(() => {
    console.log("loggedIn has changed to ", loggedIn)
  }, [loggedIn]);

  const login_token = (username, newToken, newRefreshToken) => {
    console.log("logging in with token: ", username, newToken, newRefreshToken)
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    c_setUser(username);
    console.log("setting loggedIn")
    setLoggedIn(true)
    localStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("username", username);
  };
  const loginPwd = async (username, password) => {
    const response = await fetch(`${config.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "username": username, "password": password }),
    });
    const data = await response.json();
    console.log("logging in, response: ", data)
    if (!response.ok) {
      return data["error"]
    }
    login_token(username, data.accessToken, data.refreshToken)
    return ""
  };

  const logout = () => {
    const response = fetch(`${config.apiUrl}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "refreshToken": refreshToken }),
    });
    console.log("logging out response: ", response)
    setToken(null);
    c_setUser(null);
    setRefreshToken(null);
    setLoggedIn(false)
  };

  const refreshAccessToken = async () => {
    const username = localStorage.getItem("username")
    console.log("refreshing the token")
    if (!refreshToken) {
      console.log("no token set --> logging out")
      logout();
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      if (response.ok) {
        login_token(username, data.accessToken, data.refreshToken);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  };

  // Automatically refresh token when it is about to expire
  useEffect(() => {
    if (!token) return;

    const tokenExpirationTime = 30 * 60 * 1000; // 30 minutes
    const refreshTime = tokenExpirationTime - 1 * 60 * 1000; // Refresh 1 min before expiry

    const refreshInterval = setInterval(refreshAccessToken, refreshTime);

    return () => clearInterval(refreshInterval);
  }, [token, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ 
        token, 
        login: login_token, 
        c_logout: logout, 
        refreshAccessToken, 
        loginPwd, 
        c_user,
        c_setUser,
        c_password,
        c_setPassword,
        loggedIn
      }}>
      {children}
    </AuthContext.Provider>
  );
};