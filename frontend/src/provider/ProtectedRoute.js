import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { RoomProvider } from './RoomStatus.tsx';

export const ProtectedRoute = () => {
    const { loggedIn } = useContext(AuthContext);
    const location = useLocation();
    if (loggedIn === true) {
        return (
            <RoomProvider>
                <Outlet />
            </RoomProvider>
        )
    }
    else if (loggedIn === null) {
        return <></>
    }
    else {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />
    }
};

export default ProtectedRoute;