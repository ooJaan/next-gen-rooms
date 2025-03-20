import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

import config from "../config";


export const useApi = () => {
    const { token, refreshAccessToken } = useContext(AuthContext);

        const fetchWithAuth = async (endpoint, options = {}) => {
            const url = `${config.apiUrl}/${endpoint}`
            console.log("fetching data from ", url)
            let response = await fetch(url, {
              ...options,
              headers: {
                "Content-Type": "application/json", // Ensure Content-Type is always included
                "Authorization": `Bearer ${token}`, // Include token
                ...options.headers, // Allow custom headers
              },
            });

        if (response.status === 401) {
            await refreshAccessToken();
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${token}`, // Get new token
                },
            });
        }
        return response.json();

    };


    return { fetchWithAuth };
};