import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("hakwatch_user") || "null");

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "ADMIN") return <Navigate to="/" />;

  return children;
}

export default AdminRoute;
