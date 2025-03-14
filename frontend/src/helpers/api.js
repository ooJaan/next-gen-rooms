import { useContext } from "react";
import { AuthContext } from "./provider/AuthProvider";

export const useApi = () => {
    //ToDo Token will expire after some time --> renew it
    const { token } = useContext(AuthContext);

    const fetchWithAuth = async (url, options = {}) => {
        const headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(url, { ...options, headers });
        return response.json();
    };

    return { fetchWithAuth };
};