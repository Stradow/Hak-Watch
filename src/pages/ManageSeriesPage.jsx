import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/apiconfig.js";

const emptyForm = {
  title: "",
  year: "",
  rating: "",
  poster: "",
  description: "",
};

function ManageSeriesPage() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [createForm, setCreateForm] = useState(emptyForm);

  const [editingSeriesId, setEditingSeriesId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await axios.get(`${API_URL}/series`);
      setSeries(res.data || []);
    } catch (error) {
      setErrorMessage(
        "Server error. Make sure JSON Server is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (oneSeries) => {
    setEditingSeriesId(oneSeries.id);
    setEditForm({
      title: oneSeries.title || "",
      rating: oneSeries.rating ?? "",
      poster: oneSeries.poster || "",
      description: oneSeries.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingSeriesId(null);
    setEditForm(emptyForm);
  };

  const createSeries = async (e) => {
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

      const res = await axios.post(`${API_URL}/series`, payload);

      setSeries((prev) => [res.data, ...prev]);
      setCreateForm(emptyForm);
    } catch (error) {
      setErrorMessage(
        "Could not create series. Check your inputs and server status."
      );
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingSeriesId) return;
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
        `${API_URL}/series/${editingSeriesId}`,
        payload
      );

      setSeries((prev) =>
        prev.map((s) => (s.id === editingSeriesId ? res.data : s))
      );

      cancelEdit();
    } catch (error) {
      setErrorMessage(
        "Could not update series. Check your inputs and server status."
      );
    }
  };

  const deleteSeries = async (seriesId) => {
    setErrorMessage("");

    try {
      await axios.delete(`${API_URL}/series/${seriesId}`);
      setSeries((prev) => prev.filter((s) => s.id !== seriesId));
      if (editingSeriesId === seriesId) cancelEdit();
    } catch (error) {
      setErrorMessage("Could not delete series. Server error.");
    }
  };

  return (
    <section className="admin-movies-container">
      <header className="admin-page-header">
        <h1>Manage Series</h1>
        <p>Create, edit, and delete series from the database.</p>
      </header>

      {errorMessage && <p>{errorMessage}</p>}

      <section className="admin-create-panel">
        <h2>Create a New Series</h2>

        <form onSubmit={createSeries} className="admin-form">
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
            <button type="submit">Create Series</button>
            <button type="button" onClick={() => setCreateForm(emptyForm)}>
              Clear
            </button>
          </div>
        </form>
      </section>

      <section className="admin-list-panel">
        <h2>Series</h2>

        {loading && <p>Loading series...</p>}

        {!loading && (
          <div className="admin-movies-list">
            {series.map((oneSeries) => (
              <article key={oneSeries.id} className="admin-movie-row">
                <div className="admin-movie-preview">
                  <p>
                    <strong>{oneSeries.title}</strong>
                  </p>
                  <p>Rating: {oneSeries.rating}</p>
                  <img
                    className="admin-movie-img"
                    src={oneSeries.poster}
                    alt={`${oneSeries.title} poster`}
                  />
                  <p className="admin-movie-url">{oneSeries.poster}</p>
                </div>

                <div className="admin-movie-actions">
                  <button type="button" onClick={() => startEdit(oneSeries)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSeries(oneSeries.id)}
                  >
                    Delete
                  </button>
                </div>

                {editingSeriesId === oneSeries.id && (
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

export default ManageSeriesPage;
