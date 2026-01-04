import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import axios from "axios";

const API_URL = "http://localhost:4000";

function getRandomItem(list) {
  if (!list || list.length === 0) return null;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function HomePage() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [featuredSeries, setFeaturedSeries] = useState(null);
  const [featuredAnime, setFeaturedAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const [moviesRes, seriesRes, animeRes] = await Promise.all([
          axios.get(`${API_URL}/movies`),
          axios.get(`${API_URL}/series`),
          axios.get(`${API_URL}/anime`),
        ]);

        const eligibleMovies = (moviesRes.data || []).filter(
          (movie) => Number(movie.rating) >= 8.5
        );

        const eligibleSeries = (seriesRes.data || []).filter(
          (series) => Number(series.rating) >= 8.5
        );

        const eligibleAnime = (animeRes.data || []).filter(
          (anime) => Number(anime.rating) >= 8.5
        );

        setFeaturedMovie(getRandomItem(eligibleMovies));
        setFeaturedSeries(getRandomItem(eligibleSeries));
        setFeaturedAnime(getRandomItem(eligibleAnime));
      } catch (error) {
        setErrorMessage(
          "Server error. Make sure JSON Server is running on port 4000."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <section className="homepage-container">
      <header>
        <h1>HAK Watch</h1>
        <p>Your personal watchlist for movies, series and anime.</p>
      </header>

      <main>
        <h2>Featured Today</h2>

        {loading && <p>Loading featured picks...</p>}
        {errorMessage && <p>{errorMessage}</p>}

        {!loading && !errorMessage && (
          <div>
            <article>
              <h3>Featured Movie</h3>

              {featuredMovie && (
                <>
                  <img
                    src={featuredMovie.poster}
                    alt={`${featuredMovie.title} poster`}
                    className="featured-poster"
                  />

                  <div>
                    <p>Title: {featuredMovie.title}</p>
                    <p>Rating: {featuredMovie.rating}</p>
                  </div>

                  <Popup trigger={<button>View Details</button>} modal nested>
                    {(close) => (
                      <div className="popup-content">
                        <p>
                          {featuredMovie.description ||
                            "No description available."}
                        </p>
                        <button
                          type="button"
                          className="popup-close"
                          onClick={close}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </Popup>
                </>
              )}
            </article>

            <article>
              <h3>Featured Series</h3>

              {featuredSeries && (
                <>
                  <img
                    src={featuredSeries.poster}
                    alt={`${featuredSeries.title} poster`}
                    className="featured-poster"
                  />

                  <div>
                    <p>Title: {featuredSeries.title}</p>
                    <p>Rating: {featuredSeries.rating}</p>
                  </div>

                  <Popup trigger={<button>View Details</button>} modal nested>
                    {(close) => (
                      <div className="popup-content">
                        <p>
                          {featuredSeries.description ||
                            "No description available."}
                        </p>
                        <button
                          type="button"
                          className="popup-close"
                          onClick={close}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </Popup>
                </>
              )}
            </article>

            <article>
              <h3>Featured Anime</h3>

              {featuredAnime && (
                <>
                  <img
                    src={featuredAnime.poster}
                    alt={`${featuredAnime.title} poster`}
                    className="featured-poster"
                  />

                  <div>
                    <p>Title: {featuredAnime.title}</p>
                    <p>Rating: {featuredAnime.rating}</p>
                  </div>

                  <Popup trigger={<button>View Details</button>} modal nested>
                    {(close) => (
                      <div className="popup-content">
                        <p>
                          {featuredSeries.description ||
                            "No description available."}
                        </p>
                        <button
                          type="button"
                          className="popup-close"
                          onClick={close}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </Popup>
                </>
              )}
            </article>
          </div>
        )}
      </main>
    </section>
  );
}

export default HomePage;
