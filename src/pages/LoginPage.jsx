import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:4000";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.get(`${API_URL}/users`, {
        params: { username, password },
      });

      const user = response.data && response.data[0];

      if (!user) {
        setErrorMessage("Invalid username or password.");
        return;
      }

      const loggedUser = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      localStorage.setItem("hakwatch_user", JSON.stringify(loggedUser));

      setSuccessMessage("Welcome to HAK");

      setTimeout(() => {
        if (loggedUser.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (error) {
      setErrorMessage(
        "Server error. Make sure JSON Server is running on port 4000."
      );
    }
  };

  const handleClear = () => {
    setUsername("");
    setPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <section className="login">
      {/* <h1 className="login-title">Login</h1> */}

      {errorMessage && <p>{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <div className="form-btn">
          <button type="submit">Login</button>
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        </div>
        <p>
          <em>
            If you are not a Hakster yet{" "}
            <strong>
              <Link to="/register">CLICK HERE</Link>
            </strong>
          </em>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
