import { useState } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const credentials = { username, password };
    console.log("Login attempt:", credentials);
  };

  const handleClear = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <section>
      <h1>Login</h1>
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
        <div>
          <button type="submit">Login</button>
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>
    </section>
  );
}

export default LoginPage;
