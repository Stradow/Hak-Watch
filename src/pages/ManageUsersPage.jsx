import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/apiconfig.js";

function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await axios.get(`${API_URL}/users`);
      const data = res.data || [];

      const filtered = data.filter((u) => {
        const username = (u.username || "").toLowerCase();
        const role = (u.role || "").toLowerCase();
        return username !== "admin" && role !== "admin";
      });

      setUsers(filtered);
    } catch (error) {
      setErrorMessage(
        "Server error. Make sure JSON Server is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    setErrorMessage("");

    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      setErrorMessage("Could not delete user. Server error.");
    }
  };

  return (
    <section className="admin-users-container">
      <header className="admin-page-header">
        <h1>Manage Users</h1>
        <p>Display and delete users (admin excluded).</p>
      </header>

      {errorMessage && <p>{errorMessage}</p>}

      <section className="admin-list-panel">
        <h2>Users</h2>

        {loading && <p>Loading users...</p>}

        {!loading && users.length === 0 && (
          <p>No users found (excluding admin).</p>
        )}

        {!loading && users.length > 0 && (
          <div className="admin-users-list">
            {users.map((user) => (
              <article key={user.id} className="admin-user-row">
                <div className="admin-user-preview">
                  <p>
                    <strong>{user.username}</strong>
                  </p>
                  {user.role && <p>Role: {user.role}</p>}
                  <p>User ID: {user.id}</p>
                </div>

                <div className="admin-user-actions">
                  <button type="button" onClick={() => deleteUser(user.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default ManageUsersPage;
