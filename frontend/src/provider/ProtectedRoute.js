import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export const ProtectedRoute = () => {
    const { token } = useContext(AuthContext);
    const location = useLocation();
    return token ? <Outlet /> : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />;
};

export default ProtectedRoute;