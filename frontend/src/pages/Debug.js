import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { RoomContext } from "../provider/RoomStatus.tsx";

import BookingDialog from "../comps/BookDialog";

import { useApi } from "../helpers/api";
import config from "../config";


export const Debug = () => {
    const { fetchWithAuth} = useApi();
    const [ endpoint, setEndpoint] = useState("");
    const [ data, setData] = useState("");
    const { typeAssets, status, getAllstoatus, rooms } = useContext(RoomContext);
    const { refreshAccessToken, setToken } = useContext(AuthContext);

    const refreshToken = async (e) => {
        e.preventDefault();
        await refreshAccessToken();
    }

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

    const setInvalidToken = async (e) => {
        e.preventDefault();
        setToken("invalid")
        localStorage.setItem("token", "invalid")
        console.log("token set to invalid")
    }
    return (
        <div>
            <pre>{JSON.stringify(typeAssets, null, 2)}</pre>
            <pre>{JSON.stringify(rooms, null, 2)}</pre>
            <button onClick={(e) => refreshAccessToken(e)}>Refresh Access Token</button>
            <button onClick={(e) => setInvalidToken(e)}>Set Invalid Token</button>
            <pre>{JSON.stringify(status, null, 2)}</pre>
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={(e) => setEndpoint(e.target.value)}></input>
                <button type="submit">Test Endpoint</button>
            </form>
            <pre> {data} </pre>
        </div>
    )
}