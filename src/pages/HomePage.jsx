import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

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

  const storedUser = localStorage.getItem("hakwatch_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user.id : null;

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

  const addToWatchlist = async (item, type) => {
    if (!user) return;

    const payload = {
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    if (type === "movie") payload.movieId = item.id;
    if (type === "series") payload.seriesId = item.id;
    if (type === "anime") payload.animeId = item.id;

    try {
      const existsRes = await axios.get(`${API_URL}/watchlist`, {
        params: { userId: user.id, ...payload },
      });

      if ((existsRes.data || []).length > 0) return;

      await axios.post(`${API_URL}/watchlist`, payload);
    } catch (error) {}
  };

  return (
    <section className="homepage-container">
      <header>
        <h1>HAK Watch</h1>
        <p>Your personal watchlist for movies, series and anime.</p>
      </header>

      <main>
        <h2>Featured</h2>

        {loading && <p>Loading featured picks...</p>}
        {errorMessage && <p>{errorMessage}</p>}

        {!loading && !errorMessage && (
          <div>
            {/* Featured Movie */}
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
                      <div className="popup-container">
                        <div className="popup-content">
                          <img
                            src={featuredMovie.poster}
                            alt={`${featuredMovie.title} poster`}
                            className="popup-img"
                          />

                          <div className="popup-details">
                            <h2 className="popup-title">
                              {featuredMovie.title}
                            </h2>

                            <p className="popup-meta">
                              <span>Year: {featuredMovie.year}</span>
                              <span>Rating: {featuredMovie.rating}</span>
                            </p>

                            <p className="popup-description">
                              {featuredMovie.description ||
                                "No description available."}
                            </p>

                            {userId && (
                              <div className="popup-actions">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() =>
                                    addToWatchlist(featuredMovie, "movie")
                                  }
                                >
                                  Add to Watchlist
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

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

            {/* Featured Series */}
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
                      <div className="popup-container">
                        <div className="popup-content">
                          <img
                            src={featuredSeries.poster}
                            alt={`${featuredSeries.title} poster`}
                            className="popup-img"
                          />

                          <div className="popup-details">
                            <h2 className="popup-title">
                              {featuredSeries.title}
                            </h2>

                            <p className="popup-meta">
                              <span>Year: {featuredSeries.year}</span>
                              <span>Rating: {featuredSeries.rating}</span>
                            </p>

                            <p className="popup-description">
                              {featuredSeries.description ||
                                "No description available."}
                            </p>

                            {userId && (
                              <div className="popup-actions">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() =>
                                    addToWatchlist(featuredSeries, "series")
                                  }
                                >
                                  Add to Watchlist
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

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

            {/* Featured Anime */}
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
                      <div className="popup-container">
                        <div className="popup-content">
                          <img
                            src={featuredAnime.poster}
                            alt={`${featuredAnime.title} poster`}
                            className="popup-img"
                          />

                          <div className="popup-details">
                            <h2 className="popup-title">
                              {featuredAnime.title}
                            </h2>

                            <p className="popup-meta">
                              <span>Year: {featuredAnime.year}</span>
                              <span>Rating: {featuredAnime.rating}</span>
                            </p>

                            <p className="popup-description">
                              {featuredAnime.description ||
                                "No description available."}
                            </p>

                            {userId && (
                              <div className="popup-actions">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() =>
                                    addToWatchlist(featuredAnime, "anime")
                                  }
                                >
                                  Add to Watchlist
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

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
