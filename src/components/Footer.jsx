import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <button>
        <NavLink
          to="https://github.com/Stradow/Hak-Watch/tree/main"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="./src/assets/images/Githublogo.png" alt="Git-Hub-Logo" />
        </NavLink>
      </button>
    </div>
  );
}
export default Footer;
