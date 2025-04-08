import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import config from "../config";
import { AuthContext } from "../provider/AuthProvider";
import '../css/Login.css'
import { useValidatePw } from "../helpers/ValidatePw";


const Register = () => {
    const [user, setLocalUser] = useState("")
    const [password, setPassword] = useState("")
    const [password1, setPassword1] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState(null)

    const { c_user, c_setUser } = useContext(AuthContext)
    const { c_password, c_setPassword } = useContext(AuthContext)
    const navigate = useNavigate();
    const { validate } = useValidatePw();

    useEffect(() => {
        if (password === "" | password1 === "" | user === "" | email === "") {
            setError("")
            return
        }
        if (password !== password1) {
            setError("Die Passwörter stimmen nicht überein!")
            return
        }
        setError(validate(password))
        setError(validate(password1))
    }, [password, password1])

    const Submit = async (e) => {
        e.preventDefault()
        if (password !== password1) {
            setError("Die Passwörter stimmen nicht überein!")
            setPassword("")
            setPassword1("")
            return
        }
        try {
            const response = await fetch(`${config.apiUrl}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        "displayname": user,
                        "username": user,
                        "password": password,
                        "email": email
                    }
                ),
            });
            const data = await response.json()
            if (response.ok) {
                console.log("successfully registered")
                c_setUser(user)
                c_setPassword(password)
                navigate('/verify')
                return
            }
            else {
                console.log("error while registering: ", data["error"])
                setError(data["error"])
            }
        }
        catch (error) {
            console.error("Register error:", error);
            setError("Registrierungs fehler:", error);
        }


    }
    return (
        <div className="login-container">
            <div className="login-form">
                <img src="logo.svg" className="auth-logo"/>
                <h1 className="title">Registrieren</h1>
                <div className="error">{error}</div>
                <form onSubmit={Submit}>
                    <input placeholder="Benutzername" onChange={(e) => setLocalUser(e.target.value)} required />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" minlenght="4" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <input type="password" placeholder="Password wiederholen" minlenght="4" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
                    <button type="submit" disabled={error !== null}>Registrieren</button>
                </form>
                <div>
                    Sie haben bereits einen Account? <Link to="/login" className="login-link">Login</Link>
                </div>
            </div>
        </div>
    )
}
export default Register;