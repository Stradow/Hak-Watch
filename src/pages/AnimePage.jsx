import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import axios from "axios";
import { API_URL } from "../config/apiconfig.js";

function AnimePage() {
  const [anime, setAnime] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const storedUser = localStorage.getItem("hakwatch_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user.id : null;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setErrorMessage("");

        const animeRes = await axios.get(`${API_URL}/anime`);
        setAnime(animeRes.data || []);

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
    }

    fetchData();
  }, [userId]);

  const addToWatchlist = async (animeItem) => {
    if (!user) return;

    try {
      const watchRes = await axios.get(`${API_URL}/watchlist`, {
        params: { userId: user.id },
      });

      const alreadyExists = (watchRes.data || []).some(
        (entry) => entry.animeId === animeItem.id
      );

      if (alreadyExists) return;

      await axios.post(`${API_URL}/watchlist`, {
        userId: user.id,
        animeId: animeItem.id,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.log("ADD TO WATCHLIST ERROR:", error);
    }
  };

  const isAnimeLiked = (animeId) => {
    return favorites.some((fav) => fav.animeId === animeId);
  };

  const toggleFavorite = async (animeItem) => {
    if (!userId) return;

    const existing = favorites.find((fav) => fav.animeId === animeItem.id);

    try {
      if (existing) {
        await axios.delete(`${API_URL}/favorites/${existing.id}`);
        setFavorites((prev) => prev.filter((fav) => fav.id !== existing.id));
      } else {
        const response = await axios.post(`${API_URL}/favorites`, {
          userId,
          animeId: animeItem.id,
          createdAt: new Date().toISOString(),
        });
        setFavorites((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.log("TOGGLE FAVORITE ERROR:", error);
    }
  };

  return (
    <section className="page-container">
      <header className="page-header">
        <h1 className="page-title">Anime</h1>
        <p className="page-subtitle">Put the search bar</p>
      </header>

      {loading && <p className="status-loading">Loading anime...</p>}
      {errorMessage && <p className="status-error">{errorMessage}</p>}

      {!loading && !errorMessage && (
        <main className="cards-grid">
          {anime.map((animeItem) => (
            <Popup
              key={animeItem.id}
              modal
              nested
              trigger={
                <article className="card" role="button" tabIndex={0}>
                  <img
                    src={animeItem.poster}
                    alt={`${animeItem.title} poster`}
                    className="card-img"
                  />
                  <div className="card-body">
                    <h3 className="card-title">{animeItem.title}</h3>
                    <p className="card-meta">
                      <span>Year: {animeItem.year}</span>
                      <span>Rating: {animeItem.rating}</span>
                    </p>
                  </div>
                </article>
              }
            >
              {(close) => (
                <div className="popup-container">
                  <div className="popup-content">
                    <img
                      src={animeItem.poster}
                      alt={`${animeItem.title} poster`}
                      className="popup-img"
                    />

                    <div className="popup-details">
                      <h2 className="popup-title">{animeItem.title}</h2>

                      <p className="popup-meta">
                        <span>Year: {animeItem.year}</span>
                        <span>Rating: {animeItem.rating}</span>
                      </p>

                      <p className="popup-description">
                        {animeItem.description || "No description available."}
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
                            onClick={() => addToWatchlist(animeItem)}
                          >
                            Add to Watchlist
                          </button>

                          <button
                            type="button"
                            className="btn btn-icon"
                            onClick={() => toggleFavorite(animeItem)}
                          >
                            <i
                              className={
                                isAnimeLiked(animeItem.id)
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

export default AnimePage;
