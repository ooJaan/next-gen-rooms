import { createContext, useState, useEffect } from "react";
import config from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(localStorage.getItem("username") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  //const [password, setPassword] = useState(localStorage.getItem("pwd") || null);

  const login_token = (username, newToken, newRefreshToken) => {
    console.log("logging in with token: ", username, newToken, newRefreshToken)
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setUser(username);
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
    setUser(null);
    setRefreshToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("pwd");
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
    <AuthContext.Provider value={{ token, login: login_token, c_logout: logout, refreshAccessToken, loginPwd }}>
      {children}
    </AuthContext.Provider>
  );
};