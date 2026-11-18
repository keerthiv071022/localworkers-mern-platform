
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Heart,
  MapPin,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";
import "./SavedWorkers.css";

function SavedWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSavedWorkers = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/saved-workers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (!controller.signal.aborted) {
          setWorkers(response.data.workers || []);
        }
      } catch (err) {
        if (
          err.code !== "ERR_CANCELED" &&
          !controller.signal.aborted
        ) {
          setError(
            err.response?.data?.message ||
              "Unable to load saved workers."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSavedWorkers();

    return () => controller.abort();
  }, []);

  const removeWorker = async (workerId) => {
    setRemovingId(workerId);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/saved-workers/${workerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkers((previous) =>
        previous.filter((worker) => worker._id !== workerId)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to remove saved worker."
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="saved-workers-page">
      <div className="saved-workers-container">
        <Link
          to="/customer/dashboard"
          className="saved-workers-back"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <header className="saved-workers-header">
          <span>YOUR FAVOURITES</span>
          <h1>My Saved Workers</h1>
          <p>
            Quickly reconnect with professionals you've saved.
          </p>
        </header>

        {error && (
          <p className="saved-workers-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading saved workers...</p>
        ) : workers.length === 0 ? (
          <div className="saved-workers-empty">
            <Heart size={42} />
            <h2>No saved workers yet</h2>
            <p>
              Explore local professionals and save your favourites
              for easy access.
            </p>
            <Link to="/workers" className="saved-workers-primary">
              Find Workers
            </Link>
          </div>
        ) : (
          <div className="saved-workers-grid">
            {workers.map((worker) => (
              <article
                key={worker._id}
                className="saved-worker-card"
              >
                <div className="saved-worker-avatar">
                  {worker.name?.charAt(0).toUpperCase()}
                </div>

                <h2>{worker.name}</h2>

                <p className="saved-worker-location">
                  <MapPin size={17} />
                  {worker.location || "Location not specified"}
                </p>

                <div className="saved-worker-skills">
                  {worker.skills?.map((skill, index) => (
                    <span key={`${skill}-${index}`}>
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="saved-worker-experience">
                  <BriefcaseBusiness size={17} />
                  {worker.experience ?? 0} years experience
                </p>

                <p
                  className={
                    worker.availability
                      ? "saved-worker-available"
                      : "saved-worker-unavailable"
                  }
                >
                  {worker.availability
                    ? "Available for Work"
                    : "Currently Unavailable"}
                </p>

                <div className="saved-worker-actions">
                  <Link to={`/workers/${worker._id}`}>
                    View Profile <ArrowRight size={17} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeWorker(worker._id)}
                    disabled={removingId === worker._id}
                  >
                    <Heart size={17} fill="currentColor" />
                    {removingId === worker._id
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default SavedWorkers;
