import { useState, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";


const Verify = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem("username"));
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState(localStorage.getItem("pwd"));

    const { loginPwd } = useContext(AuthContext);

    if (user === null | password === null) {
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
            const response = await fetch("https://api.baumi.me/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "username": user, "code": code }),
            });
            if (!response.ok) {
                const data = await response.json()
                console.log("response data: ", data)
                console.log("error while verifying: ", data["error"])
                setError(data["error"])
                return 
            }
            const err = await loginPwd(user, password)
            if (err !== ""){
                setError(`login_err: ${err}`)
                return
            }
            localStorage.removeItem("pwd")
            navigate('/')
        }
        catch (error) {
            console.error("Verify error:", error);
        }
    }
    const resendEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://api.baumi.me/auth/resend-verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "username": user }),
            });
            if(!response.ok){
                console.log("error happened while verifying")
                return
            }
            
        }
        catch (error) {
            console.error("Verify error:", error);
        }
        
    }

    return (
        <div>
            <h2>Verify Email</h2>
            {error}
            <form onSubmit={handleSubmit}>
                <input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)}/>
                <button type="submit">Verify</button>
            </form>
            <button onClick={resendEmail}>Resend Code</button>
        </div>
    )
}

export default Verify;