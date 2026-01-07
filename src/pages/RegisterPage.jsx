import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/apiconfig.js";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const existingUserRes = await axios.get(`${API_URL}/users`, {
        params: { username: trimmedUsername },
      });

      if (
        Array.isArray(existingUserRes.data) &&
        existingUserRes.data.length > 0
      ) {
        setErrorMessage("Username already exists.");
        return;
      }

      await axios.post(`${API_URL}/users`, {
        username: trimmedUsername,
        password,
        role: "USER",
      });

      setSuccessMessage("Account created! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (error) {
      setErrorMessage(
        "Server error. Make sure JSON Server is running on port 4000."
      );
    }
  };

  const handleClear = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <section className="register">
      {/* <h1 className="register-title">Register</h1> */}

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
            autoComplete="new-password"
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        <div className="form-btn">
          <button type="submit">Create account</button>
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        </div>
        <p>
          Already a Hakster? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

export default RegisterPage;
