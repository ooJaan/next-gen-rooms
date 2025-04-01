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
        setError("no username set, are you logged in or registered correctly?")
        return (
            <div>
                <h1>No username set. did you register correctly?</h1>
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
                    Verify Email
                </div>
                <div className="error">
                    {error}
                </div>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
                    <button type="submit">Verify</button>
                </form>
                <div>
                    <button onClick={resendEmail}>Resend Code</button>
                </div>
            </div>
        </div>
    )
}

export default Verify;