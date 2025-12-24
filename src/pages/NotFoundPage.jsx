import { Link } from "react-router-dom";

function NotFoundPage() {
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

      <div>
        <Link to="/">
          <button className="backhome-btn">Back to Home</button>
        </Link>

        <Link to="/watch-list">
          <button className="gotowatchlist-btn">Go to Watch List</button>
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
