import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";



const Register = () => {
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [password1, setPassword1] = useState("")
    const [email, setEmail] = useState("")
    const Submit = async (e) => {
        e.preventDefault()
        if (password !== password1) {
            alert("passwords dont match")
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
            if (response.ok){
                console.log("successfully registered")
                localStorage.setItem("username", user)
                return (
                    <Navigate to={`/verify`} />
                )
            }
            else {
                console.log("error while registering")
            }
        }
        catch (error) {
            console.error("Register error:", error);
        }
        
        
    }
    return (
        <form onSubmit={Submit}>
            <input placeholder="Username" onChange={(e) => setUser(e.target.value)} required />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" minlenght="4" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" minlenght="4" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
            <button type="submit">Register</button>
        </form>
    )
}
export default Register;