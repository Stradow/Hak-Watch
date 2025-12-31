import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import axios from "axios";

const API_URL = "http://localhost:4000";

function AnimePage() {
  const [anime, setAnime] = useState([]);
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

        const animeRespond = await axios.get(`${API_URL}/anime`);
        setAnime(animeRespond.data || []);

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
          "Server error. Make sure JSON server is running on port 4000."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const addToWatchlist = async (anime) => {
    if (!user) return;

    try {
      const existsRes = await axios.get(`${API_URL}/watchlist`, {
        params: { userId: user.id, animeId: anime.id },
      });

      if ((existsRes.data || []).length > 0) return;

      await axios.post(`${API_URL}/watchlist`, {
        userId: user.id,
        animeId: anime.id,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {}
  };

  const isAnimeLiked = (animeId) => {
    return favorites.some((fav) => fav.animeId === animeId);
  };

  const toggleFavorite = async (anime) => {
    if (!userId) return;

    const existing = favorites.find((fav) => fav.animeId === anime.id);

    try {
      if (existing) {
        await axios.delete(`${API_URL}/favorites/${existing.id}`);
        setFavorites((prev) => prev.filter((fav) => fav.id !== existing.id));
      } else {
        const response = await axios.post(`${API_URL}/favorites`, {
          userId,
          animeId: anime.id,
          createdAt: new Date().toISOString(),
        });
        setFavorites((prev) => [...prev, response.data]);
      }
    } catch (error) {}
  };

  return (
    <section className="seriespage-container">
      <header className="seriespage-header">
        <h1>Anime</h1>
        <p>Put the search bar</p>
      </header>

      {loading && <p>Loading anime...</p>}
      {errorMessage && <p>{errorMessage}</p>}

      {!loading && !errorMessage && (
        <main className="series-grid">
          {anime.map((animeItem) => (
            <Popup
              key={animeItem.id}
              modal
              nested
              trigger={
                <article className="series-card" role="button" tabIndex={0}>
                  <img
                    src={animeItem.poster}
                    alt={`${animeItem.title} poster`}
                    className="series-poster"
                  />
                  <div className="series-info">
                    <h3 className="series-title">{animeItem.title}</h3>
                    <p className="series-meta">
                      <span>Year: {animeItem.year}</span>
                      <span>Rating: {animeItem.rating}</span>
                    </p>
                  </div>
                </article>
              }
            >
              {(close) => (
                <div className="series-popup">
                  <button
                    type="button"
                    className="series-popup-close"
                    onClick={close}
                  >
                    ✕
                  </button>

                  <div className="series-popup-body">
                    <img
                      src={animeItem.poster}
                      alt={`${animeItem.title} poster`}
                      className="series-popup-poster"
                    />

                    <div className="series-popup-details">
                      <h2 className="series-popup-title">{animeItem.title}</h2>

                      <p className="series-popup-stats">
                        <span>Year: {animeItem.year}</span>
                        <span>Rating: {animeItem.rating}</span>
                      </p>

                      <p className="series-popup-description">
                        {animeItem.description || "No description available."}
                      </p>

                      {!userId ? (
                        <p className="series-popup-authmsg">
                          Please log in to add items to your Watchlist or
                          Favorites.
                        </p>
                      ) : (
                        <div className="series-popup-actions">
                          <button
                            type="button"
                            className="series-popup-btn"
                            onClick={() => addToWatchlist(animeItem)}
                          >
                            Add to Watchlist
                          </button>

                          <button
                            type="button"
                            className="heart-btn"
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
