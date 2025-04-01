import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useApi } from "../helpers/api";
import { useValidatePw } from "../helpers/ValidatePw";

const ChangePw = () => {
    const [oldPwd, setOldPwd] = useState("")
    const [newPwd, setNewPwd] = useState("")
    const [newPwd2, setNewPwd2] = useState("")
    const [error, setError] = useState(null)
    const { postWithAuth } = useApi();
    const navigate = useNavigate();
    const location = useLocation();
    const { validate } = useValidatePw();


    useEffect(() => {
        if (newPwd === "" | oldPwd === "" | newPwd2 === "") {
            setError("") //empty error disables the button but does not show a message
            return
        }
        if (newPwd !== newPwd2) {
            setError("Passwörter sind unterschiedlich")
            return
        }
        if (newPwd === oldPwd) {
            setError("Passwörter sind gleich")
            return
        }
        setError(validate(oldPwd))
        setError(validate(newPwd))

    }, [oldPwd, newPwd, newPwd2])

    const submit = async(e) => {
        e.preventDefault();
        if (error !== null) {
            console.log("error exists --> returning", error);
            return;
        }
        
        const data = {
            "oldPassword": oldPwd,
            "newPassword": newPwd
        }
        const resp = await postWithAuth("users/change-password", data)
        if (resp["error"] !== undefined) {
            console.log(resp["error"])
            setError(resp["error"])
            return
        }
        if (error === null) {
            console.log("all good --> redir")
            const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
            navigate(redirectPath);
        }

    }
    return (
        <div className="login-container">
            <div className="login-form">
                <div class="title">
                    Passwort Ändern
                </div>
                <div className="error">{error}</div>
                <form onSubmit={submit}>
                    <input type="password" placeholder="Altes Passwort" onChange={(e) => setOldPwd(e.target.value)} required />
                    <input type="password" placeholder="Neues Passwort" onChange={(e) => setNewPwd(e.target.value)} required />
                    <input type="password" placeholder="Neues Passwort widerhohlen" onChange={(e) => setNewPwd2(e.target.value)} required />
                    <button type="submit" disabled={error !== null}>Passort Ändern</button>
                </form>
            </div>

        </div>
    )
}
export default ChangePw