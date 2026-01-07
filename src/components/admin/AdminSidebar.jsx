import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <nav className="admin-sidebar">
      <NavLink to="/admin" end>
        Home
      </NavLink>
      <NavLink to="/admin/users">Manage Users</NavLink>
      <NavLink to="/admin/movies">Manage Movies</NavLink>
      <NavLink to="/admin/series">Manage Series</NavLink>
      <NavLink to="/admin/anime">Manage Anime</NavLink>
    </nav>
  );
}

export default AdminSidebar;
