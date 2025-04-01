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
            setError("Das Passwort ist falsch!")
            return
        }
        console.log(user)
        const err = await loginPwd(user, password);
        if (err !== null) {
            setError(err)
            console.log(error)
            return
        }
        const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
        navigate(redirectPath);
    };
    if (loggedIn) {
        return (
            <div>
                <h1>Already logged in <Link to="/logout">Logout?</Link></h1>
            </div>
        )
    }


    return (
        <div className="login-container">
            <div className="login-form">
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
                    Dont have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;