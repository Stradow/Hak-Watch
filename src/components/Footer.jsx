import { NavLink } from "react-router-dom";
import Githublogo from "../assets/images/Githublogo.png";

function Footer() {
  return (
    <div className="footer">
      <button>
        <NavLink
          to="https://github.com/Stradow/Hak-Watch/tree/main"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={Githublogo} alt="Git-Hub-Logo" />
        </NavLink>
      </button>
    </div>
  );
}
export default Footer;
