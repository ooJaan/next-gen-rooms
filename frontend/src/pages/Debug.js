import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";

import { useApi } from "../helpers/api";
import config from "../config";


export const Debug = () => {
    const { token, refreshAccessToken } = useContext(AuthContext);
    const { fetchWithAuth } = useApi();
    const [ endpoint, setEndpoint] = useState("");
    const [ data, setData] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setData("")
        const url= `${config.apiUrl}/${endpoint}`
        console.log("testing endponit: ", url)
        fetchWithAuth(endpoint)
        .then((data) => setData(JSON.stringify(data, null, 2)))
        .catch((err) => console.error(err));
        console.log(data)
    }
    return (
        <div>
            {token}
            <button onClick={() => refreshAccessToken()}>refresh token</button>
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={(e) => setEndpoint(e.target.value)}></input>
                <button type="submit">Test Endpoint</button>
            </form>
            <pre> {data} </pre>
        </div>
    )
}