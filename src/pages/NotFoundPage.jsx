import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section>
      <h1>404</h1>
      <h2>Page not found</h2>

      <p>The page you are looking for does not exist or has been moved.</p>

      <div>
        <Link to="/">
          <button>Back to Home</button>
        </Link>

        <Link to="/watch-list">
          <button>Go to Watch List</button>
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
