import { Link } from "react-router-dom";

function NotFoundPage() {
  const user = JSON.parse(localStorage.getItem("hakwatch_user") || "null");

  const isAdmin = user && user.role === "ADMIN";

  return (
    <section className="notfound-container">
      <img
        alt="HackWatchLogo"
        src="./src/assets/images/HakLogo.png"
        className="notfound-haklogo"
      />

      <div className="notfound-actions">
        <h1>404</h1>
        <h2>Page not found</h2>
      </div>

      <p>The page you are looking for does not exist or has been moved.</p>

      <div className="notfound-buttons">
        {isAdmin ? (
          <Link to="/admin">
            <button className="backhome-btn">Back to Admin</button>
          </Link>
        ) : (
          <Link to="/">
            <button className="backhome-btn">Back to Home</button>
          </Link>
        )}

        {!isAdmin && (
          <Link to="/watch-list">
            <button className="gotowatchlist-btn">Go to Watch List</button>
          </Link>
        )}
      </div>
    </section>
  );
}

export default NotFoundPage;
