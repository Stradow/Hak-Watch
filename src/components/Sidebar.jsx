import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <>
      <nav className="sidebar">
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/movies">Films</NavLink>
          </li>
          <li>
            <NavLink to="/series">Series</NavLink>
          </li>
          <li>
            <NavLink to="/anime">Anime</NavLink>
          </li>
          <li>
            <NavLink to="/watch-list">Watch List</NavLink>
          </li>
          <li>
            <NavLink to="/favorite">Favorites</NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Sidebar;
