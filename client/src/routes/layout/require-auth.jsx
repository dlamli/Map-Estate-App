import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { useAuthContext } from "../../hooks/useAuthContext";

function RequireAuthLayout() {
  const { user } = useAuthContext();
  
  const currentUser = user.userInfo;
  return !currentUser ? (
    <Navigate to="/login" />
  ) : (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default RequireAuthLayout;
