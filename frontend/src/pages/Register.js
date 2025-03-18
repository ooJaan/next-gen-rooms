import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";



const Register = () => {
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [password1, setPassword1] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const Submit = async (e) => {
        e.preventDefault()
        if (password !== password1) {
            setError("passwords dont match")
            setPassword("")
            setPassword1("")
            return
        }
        try {
            const response = await fetch("https://api.baumi.me/auth/register", {
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
            if (response.ok){
                console.log("successfully registered")
                localStorage.setItem("username", user)
                localStorage.setItem("pwd", password)
                return (
                    <Navigate to={`/verify`} />
                )
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
        <div>
            {error}
            <form onSubmit={Submit}>
                <input placeholder="Username" onChange={(e) => setUser(e.target.value)} required />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" minlenght="4" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm Password" minlenght="4" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}
export default Register;