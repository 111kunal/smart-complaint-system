import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // logged in, but wrong role — send them to their own dashboard instead
    const fallback =
      user.role === "admin" ? "/admin" : user.role === "agent" ? "/agent" : "/user";
    return <Navigate to={fallback} replace />;
  }

  return children;
}