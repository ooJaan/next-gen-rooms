import { useState, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
    const [user, setUser] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { loginPwd } = useContext(AuthContext);
    //const [ user, setUser] = useContext(AuthContext);
    //const [ password, setPassword] = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user)
        setError(await loginPwd(user, password));
    };

    return (
        <div>
            {error}
            <form onSubmit={handleSubmit}>
                <input placeholder="Benutzername" onChange={(e) => setUser(e.target.value)} required />
                <input type="password" placeholder="Passwort" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>

    );
};

export default Login;