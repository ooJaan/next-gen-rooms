import React, { createContext, useState, useEffect, useRef } from "react";
import config from "../config";
import { useApi } from "../helpers/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const prevLoggedIn = useRef(localStorage.getItem("token") !== null);
  const [loggedIn, setLoggedIn ] = useState(prevLoggedIn.current)
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [c_user, c_setUser] = useState(localStorage.getItem("user") || null);
  const [c_userId, c_setUserId] = useState(localStorage.getItem("userId") || null);
  const [c_role, c_setRole] = useState(localStorage.getItem("role") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [c_password, c_setPassword] = useState(localStorage.getItem("pwd") || null);



  console.log("AuthProvider re render: ", loggedIn, token, c_user, c_userId, c_role, refreshToken)
  useEffect(() => {
    if (token && c_user) {
      login_token(c_user, token, refreshToken)
    }
  },[]);
  useEffect(() => {
    console.log("c_user has changed to ", c_user)
    if (c_user) {
      localStorage.setItem("user", c_user); // Persist to localStorage
    } else {
      localStorage.removeItem("user");
    }
  }, [c_user]);
  useEffect(() => {
    console.log("c_userId has changed to ", c_userId)
    if (c_userId) {
      localStorage.setItem("userId", c_userId); // Persist to localStorage
    } else {
      localStorage.removeItem("userId");

    }
  }, [c_userId]);
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
    prevLoggedIn.current = loggedIn
  }, [loggedIn]);

  const login_token = async (username, newToken, newRefreshToken) => {
    if (username === null | newToken === null | newRefreshToken=== null) {
      setLoggedIn(false)
      return;
    }
    if (!await validateToken(newToken)){
      console.log("token invalid --> logging out")
      setLoggedIn(false)
      return
    }
    console.log("logging in with token: ", username, newToken, newRefreshToken)
    bulkSet(username, newToken, newRefreshToken)
    console.log("setting loggedIn")
  };
  const bulkSet = (username, newToken, newRefreshToken) => {
    setLoggedIn(true)
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    c_setUser(username);
  }

  const validateToken = async (newToken) => {
    console.log("validating token: ", newToken)
    const url = `${config.apiUrl}/auth/check`
    const req = {
        headers: {
          "Authorization": `Bearer ${newToken}`,
        },
        method: "POST",
    }
    const resp = await fetch(url, req)
    if (resp.status !== 200) {
        if (resp.status === 401) {
            if (await refreshAccessToken() === true) {
                return true
            } else {
                console.log("refresh token failed --> logging out")
                logout();
                return false
            }
        }
        console.log("token invalid --> logging out")
        logout();
        return false
    }
    return true
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
    c_setRole(data.role)
    localStorage.setItem("role", data.role)
    await login_token(username, data.accessToken, data.refreshToken)
    return null
  };

  const cleanup = () => {
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
    console.log(`refreshing the token, accessToken: ${token}, refreshToken: ${refreshToken}`)
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
        console.log(`refresh token successful, new accessToken: ${data.accessToken}, new refreshToken: ${data.refreshToken}`)
        await login_token(c_user, data.accessToken, data.refreshToken);
        return true
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
        loggedIn, setLoggedIn
      }}>
      {children}
    </AuthContext.Provider>
  );
};