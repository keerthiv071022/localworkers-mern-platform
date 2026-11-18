
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  CheckCircle2,
  Users,
  XCircle,
} from "lucide-react";
import "./FindWorkers.css";

const API_URL = "http://localhost:5000/api/workers";

function FindWorkers() {
  const [searchParams] = useSearchParams();

  const [workers, setWorkers] = useState([]);

  const [skill, setSkill] = useState(
    () => searchParams.get("skill") || ""
  );

  const [location, setLocation] = useState(
    () => searchParams.get("location") || ""
  );
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    setSkill(searchParams.get("skill") || "");
    setLocation(searchParams.get("location") || "");
  }, [searchParams]);
  useEffect(() => {
    const controller = new AbortController();

    const fetchWorkers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(API_URL, {
          params: {
            skill: skill.trim() || undefined,
            location: location.trim() || undefined,
            availability: availableOnly ? "true" : undefined,
          },
          signal: controller.signal,
        });

        setWorkers(response.data.workers || []);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError("Unable to load workers. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchWorkers, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [skill, location, availableOnly]);

  return (
    <main className="find-workers-page">
      <div className="find-workers-container">
        <section className="find-workers-hero">
          <span>FIND LOCAL PROFESSIONALS</span>
          <h1>Find skilled workers you can count on.</h1>
          <p>
            Explore local professionals based on their
            skills, experience, location, and availability.
          </p>
        </section>

        <section className="find-workers-filters">
          <div className="find-workers-field">
            <label htmlFor="search-skill">Service or Skill</label>
            <div className="find-workers-input">
              <Search size={19} />
              <input
                id="search-skill"
                placeholder="e.g. Carpenter, Plumber"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              />
            </div>
          </div>

          <div className="find-workers-field">
            <label htmlFor="search-location">Location</label>
            <div className="find-workers-input">
              <MapPin size={19} />
              <input
                id="search-location"
                placeholder="e.g. Kochi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <label className="find-workers-check">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) =>
                setAvailableOnly(e.target.checked)
              }
            />
            Available workers only
          </label>
        </section>

        <section className="find-workers-results">
          <div className="find-workers-results-header">
            <div>
              <h2>Explore Professionals</h2>
              <p>
                Find the right person for your next job.
              </p>
            </div>

            <span className="find-workers-count">
              <Users size={17} />
              {loading ? "Searching..." : `${workers.length} workers`}
            </span>
          </div>

          {loading ? (
            <p className="find-workers-message">
              Finding professionals...
            </p>
          ) : error ? (
            <p className="find-workers-message" role="alert">
              {error}
            </p>
          ) : workers.length === 0 ? (
            <p className="find-workers-message">
              No workers found. Try a different skill or location.
            </p>
          ) : (
            <div className="find-workers-grid">
              {workers.map((worker) => (
                <article
                  className="find-worker-card"
                  key={worker._id}
                >
                  <div className="find-worker-avatar">
                    {worker.name?.charAt(0).toUpperCase()}
                  </div>

                  <h3>{worker.name}</h3>

                  <p className="find-worker-location">
                    <MapPin size={16} />
                    {worker.location || "Location not added"}
                  </p>

                  <div className="find-worker-skills">
                    {(worker.skills || []).map((item, index) => (
                      <span key={`${item}-${index}`}>
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="find-worker-details">
                    <span>
                      <BriefcaseBusiness size={17} />
                      {worker.experience || 0} years experience
                    </span>

                    <span
                      className={
                        worker.availability
                          ? "worker-available"
                          : "worker-unavailable"
                      }
                    >
                    {worker.availability ? (
  <CheckCircle2 size={17} />
) : (
  <XCircle size={17} />
)}

{worker.availability
  ? "Available"
  : "Unavailable"}
                    </span>
                  </div>

                 
<Link
  to={`/workers/${worker._id}`}
  className="find-worker-button"
>
  View Profile
</Link>

                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default FindWorkers;
