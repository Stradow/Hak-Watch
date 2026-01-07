import axios from "axios";
import { useEffect, useState } from "react";

function FavoritesPage() {
  const [favourites, setFavourites] = useState([]);

  const loggedUser = JSON.parse(localStorage.getItem("hakwatch_user"));

  useEffect(() => {
    if (!loggedUser) {
      console.log("you need to log in");
      return;
    }

    async function getFavourites() {
      try {
        const favRes = await axios.get(
          `http://localhost:4000/favorites?userId=${loggedUser.id}`
        );

        const movieIds = favRes.data
          .map((currentItem) => currentItem.movieId)
          .filter((id) => typeof id === "number");

        const seriesIds = favRes.data
          .map((currentItem) => currentItem.seriesId)
          .filter((id) => typeof id === "number");

        const animeIds = favRes.data
          .map((currentItem) => currentItem.animeId)
          .filter((id) => typeof id === "number");

        const moviesRes = await axios.get("http://localhost:4000/movies");
        const seriesRes = await axios.get("http://localhost:4000/series");
        const animeRes = await axios.get("http://localhost:4000/anime");

        const favoriteMovies = moviesRes.data.filter((currentMovie) => {
          return movieIds.includes(currentMovie.id);
        });

        const favoriteSeries = seriesRes.data.filter((currentSeries) => {
          return seriesIds.includes(currentSeries.id);
        });

        const favoriteAnime = animeRes.data.filter((currentAnime) => {
          return animeIds.includes(currentAnime.id);
        });

        setFavourites([...favoriteMovies, ...favoriteSeries, ...favoriteAnime]);
      } catch (error) {
        console.log(error);
      }
    }

    getFavourites();
  }, []);

  return (
    <section className="page-container">
      <header className="page-header">
        <h1 className="page-title">Favorites</h1>
      </header>

      <main className="cards-grid fav-cards">
        {favourites.map((oneItem) => {
          return (
            <article className="card card-horizontal" key={oneItem.id}>
              <img
                src={oneItem.poster}
                alt={oneItem.title}
                className="card-img fav-img"
              />

              <div className="card-body">
                <h2 className="card-title">{oneItem.title}</h2>
                <p className="card-meta">Rating: {oneItem.rating}</p>
              </div>
            </article>
          );
        })}
      </main>
    </section>
  );
}

export default FavoritesPage;
