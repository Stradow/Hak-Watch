import { Routes, Route } from "react-router-dom";
import "./App.css";

import RootLayout from "./layouts/RootLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/admin/AdminRoute";

import HomePage from "./pages/HomePage";
import FavoritePage from "./pages/FavoritesPage";
import AnimePage from "./pages/AnimePage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import WatchListPage from "./pages/WatchListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

import AdminHomePage from "./pages/AdminHomePage";
import ManageUsersPage from "./pages/ManageUsersPage";
import ManageMoviesPage from "./pages/ManageMoviesPage";
import ManageSeriesPage from "./pages/ManageSeriesPage";
import ManageAnimePage from "./pages/ManageAnimePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* USER AREA */}
        <Route element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="anime" element={<AnimePage />} />
          <Route path="favorite" element={<FavoritePage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="series" element={<SeriesPage />} />
          <Route path="watch-list" element={<WatchListPage />} />
        </Route>

        {/* AUTH (NO SIDEBAR) */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* ADMIN AREA */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="movies" element={<ManageMoviesPage />} />
          <Route path="series" element={<ManageSeriesPage />} />
          <Route path="anime" element={<ManageAnimePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
