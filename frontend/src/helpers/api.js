import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

import config from "../config";


export const useApi = () => {
    const { token, refreshAccessToken, c_logout, loggedIn } = useContext(AuthContext);

    const reqWithAuth = async (endpoint, method="GET", data) => {
        const url = `${config.apiUrl}/${endpoint}`
        
        const headers = {
            "Authorization": `Bearer ${token}`,
        };
        
        // Only add Content-Type and body for non-GET requests
        const req = {
            method: method,
            headers: headers,
        };
        
        if (method !== "GET" && data) {
            req.headers["Content-Type"] = "application/json";
            req.body = JSON.stringify(data);
        }

        let response = await fetch(url, req);
        
        if (response.status === 401) {
            console.log("unauthorized --> trying to refresh the token")
            let newToken = await refreshAccessToken();
            req.headers["Authorization"] = `Bearer ${newToken}`;
            console.log("trying again with new token: ", newToken)
            let resp = await fetch(url, req);
            if (resp.status === 401) {
                throw {
                    name: "RefreshTokenFailed",
                    status: 401,
                    statusText: "Refresh Token Failed",
                    message: "Refresh token failed --> ag"
                }
            }
            return resp.json()
        }
        else if (response.status === 204) {
            return null;
        }
        else if (!response.ok) {
            if (response.status === 400) {
                const jsonData = await response.json();
                console.log("bad request: ", jsonData)
                if (jsonData.error) {
                    throw {
                        name: 'Bad Request',
                        status: response.status,
                        statusText: response.statusText,
                        error: jsonData.error,
                        message: `Bad Request: ${jsonData.error}, stack: ${jsonData.stackTrace}`
                    };
                }
            }
            throw {
                name: 'ApiError',
                status: response.status,
                statusText: response.statusText,
                message: `HTTP error! status: ${response.status} - ${response.statusText}`
            };
                    
        }
        try {
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error("error parsing json: ", error)
            return null;
        }
    }

    

    const fetchWithAuth = async (endpoint) => {
        if (!loggedIn) {
            console.log("not logged in --> returning null")
            return null;
        }
        const resp = await reqWithAuth(endpoint, "GET")
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