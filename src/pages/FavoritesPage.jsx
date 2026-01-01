import axios from "axios";
import { useEffect, useState } from "react";

function FavoritesPage() {
  const [favourites, setFavourites] = useState([]);

  const loggedUser = JSON.parse(localStorage.getItem("hakwatch_user"));

  useEffect(() => {
    if (!loggedUser) {
      console.log("you need to log in");
      return
    }
    async function getFavourites() {
      try {
        const favRes = await axios.get(
          `http://localhost:4000/favorites?userId=${loggedUser.id}`
        );

        const movieIds = favRes.data.map((currentMovieId) => {
          return currentMovieId.movieId;
        });

        const moviesRes = await axios.get("http://localhost:4000/movies");

        const favoriteMovies = moviesRes.data.filter((currentMovie) => {
          return movieIds.includes(currentMovie.id);
        });

        setFavourites(favoriteMovies);
      } catch (error) {
        console.log(error);
      }
    }
    getFavourites();
  }, []);

  return (
    <>
      <h1>FavoritesPage</h1>
      <div>
        {favourites.map((oneItem) => {
          return (
            <div
              className="card-container"
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "20px",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid white",
                padding: "10px",
              }}
              key={oneItem.id}
            >
              <img
                src={oneItem.poster}
                alt={oneItem.title}
                style={{ height: "300px" }}
              />
              <div
                className="card-info"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  color: "white",
                  marginLeft: "10px",
                }}
              >
                <h2>{oneItem.title}</h2>
                <h3>{oneItem.rating}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
export default FavoritesPage;
