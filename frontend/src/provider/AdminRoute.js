import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider.js";

const AdminRoute = () => {
    const { c_role } = useContext(AuthContext);

    if (c_role !== "Administrator") {
        return <Navigate to="/unauthorized" replace />; 
    }

    return <Outlet />;
};

export default AdminRoute;