import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

import config from "../config";


export const useApi = () => {
    const { token, refreshAccessToken } = useContext(AuthContext);

    const reqWithAuth = async (endpoint, method="GET", data) => {
        const url = `${config.apiUrl}/${endpoint}`
        console.log(`${method} to ${url} with data: ${data}`)
        const req = {
            method: method,
            headers: {
                "Content-Type": "application/json", // Ensure Content-Type is always included
                "Authorization": `Bearer ${token}`, // Include token
            },
            body: JSON.stringify(data)
        }
        let response = await fetch(url, req);
        if (response.status === 401) {
            console.log("unauthorized --> trying to refresh the token")
            await refreshAccessToken();
            response = await fetch(url, req);
        }
        if (!response.ok) {
            return {}
        }
        try {
            const jsonData = await response.json();
            return jsonData; 
        } catch (error) {
            return response;
        }
    }

    const fetchWithAuth = async (endpoint) => {
        const resp = await reqWithAuth(endpoint, "GET")
        console.log(resp)
        return resp;
    };
    const postWithAuth = async (endpoint, data) => {
        const resp = await reqWithAuth(endpoint, "POST", data)
        return resp;
    }

    const deleteWithAuth = async(endpoint, data) => {
        const resp = await reqWithAuth(endpoint, "DELETE", data)
        return resp;
    }
    const patchWithAuth = async(endpoint, data) => {
        const resp = await reqWithAuth(endpoint, "PATCH", data)
        return resp
    }

    

    return { fetchWithAuth, postWithAuth, deleteWithAuth, patchWithAuth};
};