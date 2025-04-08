import React, { createContext, useState, useEffect, useRef } from "react";
import config from "../config";
import { useApi } from "../helpers/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn ] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [c_user, c_setUser] = useState(localStorage.getItem("user") || null);
  const [c_userId, c_setUserId] = useState(localStorage.getItem("userId") || null);
  const [c_role, c_setRole] = useState(localStorage.getItem("role") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [c_password, c_setPassword] = useState(localStorage.getItem("pwd") || null);



  console.debug("AuthProvider re render: ", loggedIn, token, c_user, c_userId, c_role, refreshToken)
  useEffect(() => {
    login_token(c_user, token, refreshToken)
  },[]);
  

  const login_token = async (username, newToken, newRefreshToken) => {
    console.debug("logging in with token: ", username, newToken, newRefreshToken)
    if (username === null | newToken === null | newRefreshToken=== null) {
      // no token set
      setLoggedIn(false)
      return;
    }
    let status = await validateToken(newToken)
    switch (status) {
      case 200:
        console.log("token valid --> logging in")
        setToken(newToken)
        localStorage.setItem("token", newToken)
        setRefreshToken(newRefreshToken)
        localStorage.setItem("refreshToken", newRefreshToken)
        break
      case 401:
        console.debug("token invalid --> trying to refresh")
        if (!await refreshAccessToken()) {
          console.log("refresh token failed --> logging out")
          setLoggedIn(false)
        }
        break
      default:
        setLoggedIn(false)
        console.log("token is invalid --> logging out, status: ", status)
    }
    setLoggedIn(true)
    // at this point the token is valid and set correctly
    localStorage.setItem("user", username)
    c_setUser(username)
  };

  const validateToken = async (newToken) => {
    console.debug("validating token: ", newToken)
    const url = `${config.apiUrl}/auth/check`
    const req = {
        headers: {
          "Authorization": `Bearer ${newToken}`,
        },
        method: "POST",
    }
    const resp = await fetch(url, req)
    return resp.status
}


  const loginPwd = async (username, password) => {
    const response = await fetch(`${config.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "username": username, "password": password }),
    });
    const data = await response.json();
    console.log("logging in, response: ", data)
    if (!response.ok) {
      console.log("login response was not ok.")
      cleanup()
      return data["error"]
    }
    c_setUserId(data.userId)
    localStorage.setItem("userId", data.userId)
    c_setRole(data.role)
    localStorage.setItem("role", data.role)
    await login_token(username, data.accessToken, data.refreshToken)
    return null
  };

  const cleanup = () => {
    localStorage.clear()
    setToken(null);
    c_setUser(null);
    setRefreshToken(null);
    c_setUserId(null);
    setLoggedIn(false)
  }

  const logout = async () => {
    const response = await fetch(`${config.apiUrl}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "refreshToken": refreshToken }),
    });
    console.log("logging out response: ", response)
    cleanup()
  };

  const refreshAccessToken = async () => {
    console.log("refreshing the token")
    if (!refreshToken) {
      console.log("no token set --> logging out")
      return false;
    }
    try {
      const response = await fetch(`${config.apiUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "refreshToken": refreshToken }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("refresh token successful")
        setToken(data.accessToken)
        localStorage.setItem("token", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)
        setRefreshToken(data.refreshToken)
        return data.accessToken
      } else {
        console.log("refresh token failed --> logging out")
        return false
      }
    } catch (error) {
      return false
    }
  };

  // Automatically refresh token when it is about to expire
  useEffect(() => {
    if (!token) return;

    const tokenExpirationTime = 30 * 60 * 1000; // 30 minutes
    const refreshTime = tokenExpirationTime - 1 * 60 * 1000; // Refresh 1 min before expiry

    const refreshInterval = setInterval(() => {
      console.log("refreshing the token by timer")
      refreshAccessToken()
    }, refreshTime);

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
        c_userId,
        c_role,
        c_password,
        c_setPassword,
        loggedIn, setLoggedIn,
        setToken

      }}>
      {children}
    </AuthContext.Provider>
  );
};