import { useState, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate, useLocation, Link } from "react-router-dom";


const Login = () => {
    const [user, setUser] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { loginPwd } = useContext(AuthContext);
    const { c_user, c_setUser } = useContext(AuthContext)
    const { loggedIn } = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user)
        c_setUser(user)
        const err = await loginPwd(user, password);
        if (err !== "") {
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
        <div>
            {error}
            <form onSubmit={handleSubmit}>
                <input placeholder="Benutzername" onChange={(e) => setUser(e.target.value)} required />
                <input type="password" placeholder="Passwort" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            Dont have an account? <Link to="/register">Register</Link>
        </div>
    );
};

export default Login;