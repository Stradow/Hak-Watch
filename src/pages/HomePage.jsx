import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section>
      <header>
        <h1>HAK Watch</h1>
        <p>Your personal watchlist for movies, series and anime.</p>
      </header>

      <main>
        <h2>Featured Today</h2>
        <div>
          <Link to="/watch-list">
            <button>Go to Watch List</button>
          </Link>

          <article>
            <h3>Featured Movie</h3>
            <div>
              <p>Title: —</p>
              <p>Overview: —</p>
            </div>
            <button>View details</button>
            <Link to="/movies">
              <button>Browse Movies</button>
            </Link>
          </article>

          <article>
            <h3>Featured Series</h3>
            <div>
              <p>Title: —</p>
              <p>Overview: —</p>
            </div>
            <button>View details</button>
            <Link to="/series">
              <button>Browse Series</button>
            </Link>
          </article>

          <article>
            <h3>Featured Anime</h3>
            <div>
              <p>Title: —</p>
              <p>Overview: —</p>
            </div>
            <button>View details</button>
            <Link to="/anime">
              <button>Browse Anime</button>
            </Link>
          </article>
        </div>
      </main>
    </section>
  );
}

export default HomePage;
