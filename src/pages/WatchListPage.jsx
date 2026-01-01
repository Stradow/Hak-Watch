import axios from "axios";
import { useEffect, useState } from "react";

function WatchListPage() {
  const [watchlist, setWatchlist] = useState([]);

  const loggedUser = JSON.parse(localStorage.getItem("hakwatch_user"));

  useEffect(() => {
    if (!loggedUser) {
      console.log("you need to log in");
      return
    }
    async function getWatchlist() {
      try {
        const watchRes = await axios.get(
          `http://localhost:4000/watchlist?userId=${loggedUser.id}`
        );

        const movieIds = watchRes.data.map((currentMovieId) => {
          return currentMovieId.movieId;
        });

        const moviesRes = await axios.get("http://localhost:4000/movies");

        const watchlistMovies = moviesRes.data.filter((currentMovie) => {
          return movieIds.includes(currentMovie.id);
        });

        setWatchlist(watchlistMovies);
      } catch (error) {
        console.log(error);
      }
    }
    getWatchlist();
  }, []);

  return (
    <>
      <h1>Watchlist Page</h1>
      <div>
        {watchlist.map((oneItem) => {
          return (
            <div className="card-container" style={{display: "flex", flexDirection: "row", marginBottom: "20px", alignItems: "center", justifyContent: "space-evenly", border: "1px solid white", padding: "10px"}}               key={oneItem.id}
>
              <img
                src={oneItem.poster}
                alt={oneItem.title}
                style={{ height: "300px" }}
              />
              <div className="card-info" style={{display: "flex", flexDirection: "column", color:"white", marginLeft: "10px"}}>
                <h2>{oneItem.title}</h2>
                <h3>{oneItem.description}</h3>
                <h3>{oneItem.rating}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
export default WatchListPage;