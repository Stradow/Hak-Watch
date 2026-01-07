import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("hakwatch_user") || "null");
  const homePath = user?.role === "ADMIN" ? "/admin" : "/";

  const handleLogout = () => {
    localStorage.removeItem("hakwatch_user");
    navigate("/");
  };

  return (
    <nav className="navbar-container">
      <Link to={homePath}>
        <img
          alt="HackWatchLogo"
          src="/src/assets/images/HakLogo.png"
          className="navbar-logo"
        />
        <strong>HAK Watch</strong>
      </Link>

      <span className="navbar-sentence">
        Track what you watch. Watch what you love.
      </span>

      {!user ? (
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
      ) : (
        <div>
          <span className="navbar-username">{user.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
