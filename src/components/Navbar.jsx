import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">
        <strong>HAK Watch</strong>
      </Link>

      <span>Track what you watch. Watch what you love.</span>

      <Link to="/login">
        <button>Login</button>
      </Link>
    </nav>
  );
}

export default Navbar;
