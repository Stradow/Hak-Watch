import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";

const emptyForm = {
  title: "",
  rating: "",
  poster: "",
  description: "",
};

function ManageAnimePage() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [createForm, setCreateForm] = useState(emptyForm);

  const [editingAnimeId, setEditingAnimeId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const fetchAnime = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await axios.get(`${API_URL}/anime`);
      setAnime(res.data || []);
    } catch (error) {
      setErrorMessage(
        "Server error. Make sure JSON Server is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (oneAnime) => {
    setEditingAnimeId(oneAnime.id);
    setEditForm({
      title: oneAnime.title || "",
      rating: oneAnime.rating ?? "",
      poster: oneAnime.poster || "",
      description: oneAnime.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingAnimeId(null);
    setEditForm(emptyForm);
  };

  const createAnime = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const payload = {
        title: createForm.title.trim(),
        poster: createForm.poster.trim(),
        description: createForm.description.trim(),
        rating: Number(createForm.rating),
      };

      if (!payload.title || !payload.poster || !payload.description) return;
      if (Number.isNaN(payload.rating)) return;

      const res = await axios.post(`${API_URL}/anime`, payload);

      setAnime((prev) => [res.data, ...prev]);
      setCreateForm(emptyForm);
    } catch (error) {
      setErrorMessage(
        "Could not create anime. Check your inputs and server status."
      );
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingAnimeId) return;
    setErrorMessage("");

    try {
      const payload = {
        title: editForm.title.trim(),
        poster: editForm.poster.trim(),
        description: editForm.description.trim(),
        rating: Number(editForm.rating),
      };

      if (!payload.title || !payload.poster || !payload.description) return;
      if (Number.isNaN(payload.rating)) return;

      const res = await axios.put(
        `${API_URL}/anime/${editingAnimeId}`,
        payload
      );

      setAnime((prev) =>
        prev.map((a) => (a.id === editingAnimeId ? res.data : a))
      );

      cancelEdit();
    } catch (error) {
      setErrorMessage(
        "Could not update anime. Check your inputs and server status."
      );
    }
  };

  const deleteAnime = async (animeId) => {
    setErrorMessage("");

    try {
      await axios.delete(`${API_URL}/anime/${animeId}`);
      setAnime((prev) => prev.filter((a) => a.id !== animeId));
      if (editingAnimeId === animeId) cancelEdit();
    } catch (error) {
      setErrorMessage("Could not delete anime. Server error.");
    }
  };

  return (
    <section className="admin-anime-container">
      <header className="admin-page-header">
        <h1>Manage Anime</h1>
        <p>Create, edit, and delete anime from the database.</p>
      </header>

      {errorMessage && <p>{errorMessage}</p>}

      <section className="admin-create-panel">
        <h2>Create a New Anime</h2>

        <form onSubmit={createAnime} className="admin-form">
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

          <div className="admin-form-actions">
            <button type="submit">Create Anime</button>
            <button type="button" onClick={() => setCreateForm(emptyForm)}>
              Clear
            </button>
          </div>
        </form>
      </section>

      <section className="admin-list-panel">
        <h2>Anime</h2>

        {loading && <p>Loading anime...</p>}

        {!loading && (
          <div className="admin-anime-list">
            {anime.map((oneAnime) => (
              <article key={oneAnime.id} className="admin-anime-row">
                <div className="admin-anime-preview">
                  <p>
                    <strong>{oneAnime.title}</strong>
                  </p>
                  <p>Rating: {oneAnime.rating}</p>
                  <img
                    className="admin-anime-img"
                    src={oneAnime.poster}
                    alt={`${oneAnime.title} poster`}
                  />
                  <p className="admin-anime-url">{oneAnime.poster}</p>
                </div>

                <div className="admin-anime-actions">
                  <button type="button" onClick={() => startEdit(oneAnime)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAnime(oneAnime.id)}
                  >
                    Delete
                  </button>
                </div>

                {editingAnimeId === oneAnime.id && (
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

export default ManageAnimePage;
