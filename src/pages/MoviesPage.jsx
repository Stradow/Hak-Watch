import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import axios from "axios";

const API_URL = "http://localhost:4000";

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const storedUser = localStorage.getItem("hakwatch_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user.id : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const moviesRes = await axios.get(`${API_URL}/movies`);
        setMovies(moviesRes.data || []);

        if (userId) {
          const favRes = await axios.get(`${API_URL}/favorites`, {
            params: { userId },
          });
          setFavorites(favRes.data || []);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        setErrorMessage(
          "Server error. Make sure JSON Server is running on port 4000."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const addToWatchlist = async (movie) => {
    if (!user) return;

    try {
      const existsRes = await axios.get(`${API_URL}/watchlist`, {
        params: { userId: user.id, movieId: movie.id },
      });

      if ((existsRes.data || []).length > 0) return;

      await axios.post(`${API_URL}/watchlist`, {
        userId: user.id,
        movieId: movie.id,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {}
  };

  const isMovieLiked = (movieId) => {
    return favorites.some((fav) => fav.movieId === movieId);
  };

  const toggleFavorite = async (movie) => {
    if (!userId) return;

    const existing = favorites.find((fav) => fav.movieId === movie.id);

    try {
      if (existing) {
        await axios.delete(`${API_URL}/favorites/${existing.id}`);
        setFavorites((prev) => prev.filter((fav) => fav.id !== existing.id));
      } else {
        const response = await axios.post(`${API_URL}/favorites`, {
          userId,
          movieId: movie.id,
          createdAt: new Date().toISOString(),
        });
        setFavorites((prev) => [...prev, response.data]);
      }
    } catch (error) {}
  };

  return (
    <section className="page-container">
      <header className="page-header">
        <h1 className="page-title">Movies</h1>
        <p className="page-subtitle">Put the search bar</p>
      </header>

      {loading && <p className="status-loading">Loading movies...</p>}
      {errorMessage && <p className="status-error">{errorMessage}</p>}

      {!loading && !errorMessage && (
        <main className="cards-grid">
          {movies.map((movie) => (
            <Popup
              key={movie.id}
              modal
              nested
              trigger={
                <article className="card" role="button" tabIndex={0}>
                  <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    className="card-img"
                  />
                  <div className="card-body">
                    <h3 className="card-title">{movie.title}</h3>
                    <p className="card-meta">
                      <span>Year: {movie.year}</span>
                      <span>Rating: {movie.rating}</span>
                    </p>
                  </div>
                </article>
              }
            >
              {(close) => (
                <div className="popup-container">
                  <div className="popup-content">
                    <img
                      src={movie.poster}
                      alt={`${movie.title} poster`}
                      className="popup-img"
                    />

                    <div className="popup-details">
                      <h2 className="popup-title">{movie.title}</h2>

                      <p className="popup-meta">
                        <span>Year: {movie.year}</span>
                        <span>Rating: {movie.rating}</span>
                      </p>

                      <p className="popup-description">
                        {movie.description || "No description available."}
                      </p>

                      {!userId ? (
                        <p className="popup-message">
                          Please log in to add items to your Watchlist or
                          Favorites.
                        </p>
                      ) : (
                        <div className="popup-actions">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => addToWatchlist(movie)}
                          >
                            Add to Watchlist
                          </button>

                          <button
                            type="button"
                            className="btn btn-icon"
                            onClick={() => toggleFavorite(movie)}
                          >
                            <i
                              className={
                                isMovieLiked(movie.id)
                                  ? "bi bi-heart-fill"
                                  : "bi bi-heart"
                              }
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="button" className="popup-close" onClick={close}>
                    ✕
                  </button>
                </div>
              )}
            </Popup>
          ))}
        </main>
      )}
    </section>
  );
}

export default MoviesPage;
