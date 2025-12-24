import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <button>
        <NavLink>
          <img src="./src/assets/images/Githublogo.png" alt="Git-Hub-Logo" />
        </NavLink>
      </button>
    </div>
  );
}
export default Footer;
