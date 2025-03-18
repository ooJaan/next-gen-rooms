import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const Logout = () => {
  const { c_logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get the redirect path from the query string or default to '/'
    const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";

    console.log("Redirecting to ", redirectPath);

    // Execute the logout logic
    c_logout();

    // Navigate to the redirect path immediately
    navigate(redirectPath);
  }, [c_logout, location.search, navigate]); // Add missing dependencies

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
}

export default Logout;