import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/apiconfig.js";

function WatchListPage() {
  const [watchlist, setWatchlist] = useState([]);

  const loggedUser = JSON.parse(localStorage.getItem("hakwatch_user"));

  useEffect(() => {
    if (!loggedUser) {
      console.log("you need to log in");
      return;
    }

    async function getWatchlist() {
      try {
        const watchRes = await axios.get(
          `${API_URL}/watchlist?userId=${loggedUser.id}`
        );

        const entries = watchRes.data || [];

        const movieIds = entries
          .map((e) => e.movieId)
          .filter((id) => typeof id === "number");

        const seriesIds = entries
          .map((e) => e.seriesId)
          .filter((id) => typeof id === "number");

        const animeIds = entries
          .map((e) => e.animeId)
          .filter((id) => typeof id === "number");

        const [moviesRes, seriesRes, animeRes] = await Promise.all([
          axios.get(`${API_URL}/movies`),
          axios.get(`${API_URL}/series`),
          axios.get(`${API_URL}/anime`),
        ]);

        const movies = moviesRes.data || [];
        const series = seriesRes.data || [];
        const anime = animeRes.data || [];

        const moviesById = new Map(movies.map((m) => [m.id, m]));
        const seriesById = new Map(series.map((s) => [s.id, s]));
        const animeById = new Map(anime.map((a) => [a.id, a]));

        const combined = entries
          .map((entry) => {
            if (entry.movieId && moviesById.has(entry.movieId)) {
              return {
                entryId: entry.id,
                type: "Movie",
                item: moviesById.get(entry.movieId),
              };
            }

            if (entry.seriesId && seriesById.has(entry.seriesId)) {
              return {
                entryId: entry.id,
                type: "Series",
                item: seriesById.get(entry.seriesId),
              };
            }

            if (entry.animeId && animeById.has(entry.animeId)) {
              return {
                entryId: entry.id,
                type: "Anime",
                item: animeById.get(entry.animeId),
              };
            }

            return null;
          })
          .filter(Boolean);

        setWatchlist(combined);
      } catch (error) {
        console.log(error);
      }
    }

    getWatchlist();
  }, []);

  const markAsWatched = async (entryId) => {
    try {
      await axios.delete(`${API_URL}/watchlist/${entryId}`);
      setWatchlist((prev) => prev.filter((w) => w.entryId !== entryId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="page-container">
      <header className="page-header">
        <h1 className="page-title">Watchlist</h1>
      </header>

      <main className="cards-grid watchlist-card">
        {watchlist.map((oneEntry) => {
          const oneItem = oneEntry.item;

          return (
            <article className="card card-horizontal" key={oneEntry.entryId}>
              <img
                src={oneItem.poster}
                alt={oneItem.title}
                className="card-img"
              />

              <div className="card-body">
                <h2 className="card-title">{oneItem.title}</h2>

                {oneItem.description && (
                  <p className="card-description">{oneItem.description}</p>
                )}

                <p className="card-meta">
                  <span>{oneEntry.type}</span>
                  <span>Rating: {oneItem.rating}</span>
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => markAsWatched(oneEntry.entryId)}
                >
                  Watched
                </button>
              </div>
            </article>
          );
        })}
      </main>
    </section>
  );
}

export default WatchListPage;
