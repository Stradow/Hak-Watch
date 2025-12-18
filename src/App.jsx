import { Routes, Route } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import FavoritePage from "./pages/FavoritesPage";
import AnimePage from "./pages/AnimePage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import WatchListPage from "./pages/WatchListPage";

function App() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/anime" element={<AnimePage />} />
        <Route path="/favorite" element={<FavoritePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/watch-list" element={<WatchListPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
