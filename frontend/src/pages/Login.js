import { useState, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate, useLocation, Link } from "react-router-dom";

import "../css/Login.css"
import { useValidatePw } from "../helpers/ValidatePw";


const Login = () => {
    const [user, setUser] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { loginPwd } = useContext(AuthContext);
    const { loggedIn } = useContext(AuthContext);
    const { validate } = useValidatePw();

    const handleSubmit = async (e) => {
        setError(null)
        e.preventDefault();
        if (validate(password) !== null){
            setError("Das Passwort ist falsch!");
            return
        }
        console.log(user)
        const err = await loginPwd(user, password);
        if (err !== null) {
            if(err === "The password is not correct.")
            {
                setError("Das Passwort ist falsch!");
                return;
            }else{
            setError(err)
            console.log(error)
            return
            }
        }
        const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
        navigate(redirectPath);
    };
    if (loggedIn) {
        return (
            <div>
                <h1>Bereits eingelogged <Link to="/logout">Ausloggen?</Link></h1>
            </div>
        )
    }


    return (
        <div className="login-container">
            <div className="login-form">
                <img src="logo.svg" className="auth-logo"/>
                <div className="title">
                    Login
                </div>
                <div className="error">
                    {error}
                </div>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Benutzername" onChange={(e) => setUser(e.target.value)} required />
                    <input type="password" placeholder="Passwort" onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
                <div>
                    Sie haben noch keinen Account? <Link to="/register" className="login-link">Registrieren</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;