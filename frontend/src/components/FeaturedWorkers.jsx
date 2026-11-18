
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Star,
  MapPin,
  ArrowUpRight,
  BadgeCheck,
} from "lucide-react";
import "./FeaturedWorkers.css";

function FeaturedWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchWorkers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/workers",
          { signal: controller.signal }
        );

        if (!controller.signal.aborted) {
          const workerList = response.data.workers || [];
          setWorkers(workerList.slice(0, 3));
        }
      } catch (err) {
        if (
          err.code !== "ERR_CANCELED" &&
          !controller.signal.aborted
        ) {
          setError("Unable to load featured workers.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchWorkers();

    return () => controller.abort();
  }, []);

  const getInitials = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();

  const colors = ["green", "blue", "orange"];

  return (
    <section className="featured-section">
      <div className="container">
        <div className="featured-heading">
          <div>
            <span className="section-eyebrow">
              MEET THE PROFESSIONALS
            </span>
            <h2>Trusted experts near you</h2>
            <p>
              Connect with skilled professionals
              who are ready to help.
            </p>
          </div>

          <Link to="/workers" className="featured-view-all">
            View all workers <ArrowUpRight size={18} />
          </Link>
        </div>

        {loading ? (
          <p>Loading featured workers...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : workers.length === 0 ? (
          <p>No workers available yet.</p>
        ) : (
          <div className="workers-grid">
            {workers.map((worker, index) => (
              <article className="worker-card" key={worker._id}>
                <div className="worker-card-top">
                  <div
                    className={`worker-avatar avatar-${
                      colors[index % colors.length]
                    }`}
                  >
                    {getInitials(worker.name)}
                  </div>

                  {typeof worker.averageRating === "number" &&
                    worker.averageRating > 0 && (
                      <span className="worker-rating">
                        <Star size={15} fill="currentColor" />
                        {worker.averageRating.toFixed(1)}
                      </span>
                    )}
                </div>

                <div className="worker-details">
                  <div className="worker-name-row">
                    <h3>{worker.name}</h3>

                    {worker.isVerified && (
                      <BadgeCheck
                        size={18}
                        className="verified-icon"
                      />
                    )}
                  </div>

                  <p className="worker-profession">
                    {worker.skills?.join(", ") ||
                      "Skilled Professional"}
                  </p>

                  <p className="worker-experience">
                    {worker.experience ?? 0} years experience
                  </p>

                  <div className="worker-location">
                    <MapPin size={15} />
                    {worker.location || "Location not specified"}
                  </div>
                </div>

                <Link
                  to={`/workers/${worker._id}`}
                  className="worker-profile-link"
                >
                  View profile <ArrowUpRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedWorkers;
