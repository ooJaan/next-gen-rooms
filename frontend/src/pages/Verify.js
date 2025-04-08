import { useState, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";

import config from "../config";


const Verify = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const { c_user, c_setUser } = useContext(AuthContext);
    const { c_password, c_setPassword } = useContext(AuthContext);

    const { loginPwd } = useContext(AuthContext);

    if (c_user === null | c_password === null) {
        setError("Kein Username gesetzt, sind Sie bereits eingelogged?")
        return (
            <div>
                <h1>Kein Username gesetzt, sind Sie bereits eingelogged?</h1>
            </div>
        )
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.apiUrl}/auth/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "username": c_user, "code": code }),
            });
            if (!response.ok) {
                const data = await response.json()
                console.log("response data: ", data)
                console.log("error while verifying: ", data["error"])
                setError(data["error"])
                return
            }
            const err = await loginPwd(c_user, c_password)
            if (err !== null) {
                setError(`login_err: ${err}`)
                return
            }
            navigate('/')
        }
        catch (error) {
            console.error("Verify error:", error);
        }
    }
    const resendEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.apiUrl}/auth/resend-verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "username": c_user }),
            });
            if (!response.ok) {
                console.log("error happened while verifying")
                return
            }

        }
        catch (error) {
            console.error("Verify error:", error);
        }

    }

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="title">
                    Email verifizieren
                </div>
                <div className="error">
                    {error}
                </div>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
                    <button className="btn-secondary" onClick={resendEmail}>Code erneut senden</button>
                    <button type="submit">Verifizieren</button>
                </form>
            </div>
        </div>
    )
}

export default Verify;