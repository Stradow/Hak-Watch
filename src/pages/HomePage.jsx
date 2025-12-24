import { Link } from "react-router-dom";
import Popup from "reactjs-popup";

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

          <div>
            <h4>Popup - GeeksforGeeks</h4>
            <Popup
              trigger={<button> View Details </button>}
              position="right center"
            >
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
                assumenda, nulla reprehenderit eveniet possimus ducimus est eum
                amet deserunt consequatur commodi ut vel ad doloremque ullam
                nisi quo atque. Distinctio culpa pariatur ullam laborum
                praesentium velit quis, quae ratione perspiciatis quos totam
                possimus eum saepe dolore cupiditate temporibus cumque
                laudantium.
              </div>
            </Popup>
          </div>

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
