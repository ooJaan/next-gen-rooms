import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(localStorage.getItem("user") || null);
    //const [password, setPassword] = useState(localStorage.getItem("pwd") || null);

    const login_token = (newToken, username) => {
        setToken(newToken);
        setUser(username);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", user);
    };
    const loginPwd = async(username, password) => {
        const response = await fetch("https://api.baumi.me/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": username, "password": password }),
        });
        const data = await response.json();
        console.log("logging in, response: ", data)
        if (!response.ok){
            return data["error"]
        }
        login_token(data.accessToken)
        return ""
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("pwd");
    };

    return (
        <AuthContext.Provider value={{ token, login: login_token, logout, loginPwd}}>
            {children}
        </AuthContext.Provider>
    );
};