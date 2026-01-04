import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";

const emptyForm = {
  title: "",
  year: "",
  rating: "",
  poster: "",
  description: "",
};

function ManageMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [createForm, setCreateForm] = useState(emptyForm);

  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await axios.get(`${API_URL}/movies`);
      setMovies(res.data || []);
    } catch (error) {
      setErrorMessage(
        "Server error. Make sure JSON Server is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (movie) => {
    setEditingMovieId(movie.id);
    setEditForm({
      title: movie.title || "",
      year: movie.year ?? "",
      rating: movie.rating ?? "",
      poster: movie.poster || "",
      description: movie.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingMovieId(null);
    setEditForm(emptyForm);
  };

  const createMovie = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const payload = {
        title: createForm.title.trim(),
        poster: createForm.poster.trim(),
        description: createForm.description.trim(),
        rating: Number(createForm.rating),
      };

      if (createForm.year !== "") {
        payload.year = Number(createForm.year);
      }

      if (!payload.title || !payload.poster || !payload.description) return;
      if (Number.isNaN(payload.rating)) return;

      const res = await axios.post(`${API_URL}/movies`, payload);

      setMovies((prev) => [res.data, ...prev]);
      setCreateForm(emptyForm);
    } catch (error) {
      setErrorMessage(
        "Could not create movie. Check your inputs and server status."
      );
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingMovieId) return;
    setErrorMessage("");

    try {
      const payload = {
        title: editForm.title.trim(),
        poster: editForm.poster.trim(),
        description: editForm.description.trim(),
        rating: Number(editForm.rating),
      };

      if (editForm.year !== "") {
        payload.year = Number(editForm.year);
      }

      if (!payload.title || !payload.poster || !payload.description) return;
      if (Number.isNaN(payload.rating)) return;

      const res = await axios.put(
        `${API_URL}/movies/${editingMovieId}`,
        payload
      );

      setMovies((prev) =>
        prev.map((m) => (m.id === editingMovieId ? res.data : m))
      );

      cancelEdit();
    } catch (error) {
      setErrorMessage(
        "Could not update movie. Check your inputs and server status."
      );
    }
  };

  const deleteMovie = async (movieId) => {
    setErrorMessage("");

    try {
      await axios.delete(`${API_URL}/movies/${movieId}`);
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
      if (editingMovieId === movieId) cancelEdit();
    } catch (error) {
      setErrorMessage("Could not delete movie. Server error.");
    }
  };

  return (
    <section className="admin-movies-container">
      <header className="admin-page-header">
        <h1>Manage Movies</h1>
        <p>Create, edit, and delete movies from the database.</p>
      </header>

      {errorMessage && <p>{errorMessage}</p>}

      <section className="admin-create-panel">
        <h2>Create a New Movie</h2>

        <form onSubmit={createMovie} className="admin-form">
          <label>
            <strong>Title</strong>
            <input
              name="title"
              type="text"
              value={createForm.title}
              onChange={handleCreateChange}
              required
            />
          </label>

          <label>
            <strong>Rating</strong>
            <input
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={createForm.rating}
              onChange={handleCreateChange}
              required
            />
          </label>

          <label>
            <strong>Poster URL</strong>
            <input
              name="poster"
              type="url"
              value={createForm.poster}
              onChange={handleCreateChange}
              required
            />
          </label>

          <label>
            <strong>Description</strong>
            <textarea
              name="description"
              value={createForm.description}
              onChange={handleCreateChange}
              required
              rows={4}
            />
          </label>

          <label>
            <strong>Year</strong>
            <input
              name="year"
              type="number"
              min="1888"
              max="2100"
              value={createForm.year}
              onChange={handleCreateChange}
            />
          </label>

          <div className="admin-form-actions">
            <button type="submit">Create Movie</button>
            <button type="button" onClick={() => setCreateForm(emptyForm)}>
              Clear
            </button>
          </div>
        </form>
      </section>

      <section className="admin-list-panel">
        <h2>Movies</h2>

        {loading && <p>Loading movies...</p>}

        {!loading && (
          <div className="admin-movies-list">
            {movies.map((movie) => (
              <article key={movie.id} className="admin-movie-row">
                <div className="admin-movie-preview">
                  <p>
                    <strong>{movie.title}</strong>
                  </p>
                  <p>Rating: {movie.rating}</p>
                  {movie.year && <p>Year: {movie.year}</p>}
                  <img
                    className="admin-movie-img"
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                  />
                  <p className="admin-movie-url">{movie.poster}</p>
                </div>

                <div className="admin-movie-actions">
                  <button type="button" onClick={() => startEdit(movie)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteMovie(movie.id)}>
                    Delete
                  </button>
                </div>

                {editingMovieId === movie.id && (
                  <form
                    onSubmit={saveEdit}
                    className="admin-form admin-edit-form"
                  >
                    <label>
                      Title
                      <input
                        name="title"
                        type="text"
                        value={editForm.title}
                        onChange={handleEditChange}
                        required
                      />
                    </label>

                    <label>
                      Rating
                      <input
                        name="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={editForm.rating}
                        onChange={handleEditChange}
                        required
                      />
                    </label>

                    <label>
                      Poster URL
                      <input
                        name="poster"
                        type="url"
                        value={editForm.poster}
                        onChange={handleEditChange}
                        required
                      />
                    </label>

                    <label>
                      Description
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        required
                        rows={4}
                      />
                    </label>

                    <label>
                      Year (optional)
                      <input
                        name="year"
                        type="number"
                        min="1888"
                        max="2100"
                        value={editForm.year}
                        onChange={handleEditChange}
                      />
                    </label>

                    <div className="admin-form-actions">
                      <button type="submit">Save</button>
                      <button type="button" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default ManageMoviesPage;
