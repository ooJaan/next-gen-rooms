import { useState } from "react";
import { AuthContext } from "../provider/AuthProvider";

const Verify = () => {
    const [user, setUser] = useState(localStorage.getItem("username"));
    const [code, setCode] = useState("");
    const [password, setPassword] = useState(localStorage.getItem("pwd"));

    if (user === null | password === null) {
        return (
            <div>
                <h1>No username set. did you register correctly?</h1>
            </div>
        )
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://api.baumi.me/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "username": user, "code": code }),
            });
            if (response.ok) {

            }
        }
        catch (error) {
            console.error("Verify error:", error);
        }
    }
    const login = async () => {
        const response = await fetch("https://api.baumi.me/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": user, "password": password }),
        });
        const data = await response.json();
            if (response.ok) {
                login(data.accessToken);
            } else {
                alert("Invalid credentials");
            }
    }
    const resendEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://api.baumi.me//auth/resend-verify-email", {
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
            <form onSubmit={handleSubmit}>
                <input placeholder="Code" value={code} onchange={(e) => setCode(e.target.value)}/>
                <button type="submit">Verify</button>
            </form>
            <button onclick={resendEmail}>Resend Code</button>
        </div>
    )
}

export default Verify;