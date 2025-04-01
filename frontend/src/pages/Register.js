import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../config";
import { AuthContext } from "../provider/AuthProvider";
import '../css/Login.css'



const Register = () => {
    const [user, setLocalUser] = useState("")
    const [password, setPassword] = useState("")
    const [password1, setPassword1] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    const { c_user, c_setUser } = useContext(AuthContext)
    const { c_password, c_setPassword } = useContext(AuthContext)
    const navigate = useNavigate();
    const Submit = async (e) => {
        e.preventDefault()
        if (password !== password1) {
            setError("passwords dont match")
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
            setError("Register error:", error);
        }


    }
    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Registrieren</h1>
                {error}
                <form onSubmit={Submit}>
                    <input placeholder="Username" onChange={(e) => setLocalUser(e.target.value)} required />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" minlenght="4" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <input type="password" placeholder="Confirm Password" minlenght="4" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
                    <button type="submit">Registrieren</button>
                </form>
            </div>
        </div>
    )
}
export default Register;