

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  CheckCircle2,
  ShieldCheck,
  Wrench,
  CalendarDays,    
  Star,
  Heart,
} from "lucide-react";
import "./WorkerDetails.css";
import RequestServiceForm from "../components/RequestserviceForm";

function WorkerDetails() {
    const navigate = useNavigate();
  const { id } = useParams();

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [isSaved, setIsSaved] = useState(false);
const [savingWorker, setSavingWorker] = useState(false);
const [saveError, setSaveError] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reviews, setReviews] = useState([]);
const [averageRating, setAverageRating] = useState(0);
const [reviewsLoading, setReviewsLoading] = useState(true);
const [reviewsError, setReviewsError] = useState("");
  useEffect(() => {
    const controller = new AbortController();

    const fetchWorker = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `http://localhost:5000/api/workers/${id}`,
          { signal: controller.signal }
        );

        setWorker(response.data.worker);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError(
            err.response?.data?.message ||
              "Unable to load worker details."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchWorker();

    return () => controller.abort();
  }, [id]);

useEffect(() => {
  const controller = new AbortController();

  const fetchReviews = async () => {
    setReviewsLoading(true);
    setReviewsError("");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/worker/${id}`,
        { signal: controller.signal }
      );

      if (!controller.signal.aborted) {
        setReviews(response.data.reviews || []);
        setAverageRating(response.data.averageRating || 0);
      }
    } catch (err) {
      if (
        err.code !== "ERR_CANCELED" &&
        !controller.signal.aborted
      ) {
        setReviewsError(
          "Unable to load customer reviews."
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setReviewsLoading(false);
      }
    }
  };

  fetchReviews();

  return () => controller.abort();
}, [id]);

useEffect(() => {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  if (!token || user?.role !== "customer") {
    setIsSaved(false);
    return;
  }

  const controller = new AbortController();

  const checkSavedWorker = async () => {
    try {
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
        const alreadySaved = response.data.workers.some(
          (savedWorker) => savedWorker._id === id
        );

        setIsSaved(alreadySaved);
      }
    } catch (err) {
      if (
        err.code !== "ERR_CANCELED" &&
        !controller.signal.aborted
      ) {
        setSaveError("Unable to check saved status.");
      }
    }
  };

  checkSavedWorker();

  return () => controller.abort();
}, [id]);

const handleSaveWorker = async () => {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  if (!token || !user) {
    navigate("/login");
    return;
  }

  if (user.role !== "customer") {
    setSaveError("Only customers can save workers.");
    return;
  }

  setSavingWorker(true);
  setSaveError("");

  try {
    if (isSaved) {
      await axios.delete(
        `http://localhost:5000/api/saved-workers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsSaved(false);
    } else {
      await axios.post(
        `http://localhost:5000/api/saved-workers/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsSaved(true);
    }
  } catch (err) {
    setSaveError(
      err.response?.data?.message ||
        "Unable to update saved worker."
    );
  } finally {
    setSavingWorker(false);
  }
};

  return (
    <main className="worker-details-page">
      <div className="worker-details-container">
        <Link to="/workers" className="worker-details-back">
          <ArrowLeft size={18} />
          Back to Workers
        </Link>

        {loading ? (
          <div className="worker-details-message">
            Loading professional profile...
          </div>
        ) : error ? (
          <div className="worker-details-message" role="alert">
            {error}
          </div>
        ) : worker ? (
          <>
            <section className="worker-details-hero">
              <div className="worker-details-avatar">
                {worker.name?.charAt(0).toUpperCase()}
              </div>

              <div className="worker-details-intro">
                <span className="worker-details-eyebrow">
                  LOCAL PROFESSIONAL
                </span>

                <h1>{worker.name}</h1>

                <p>
                  <MapPin size={18} />
                  {worker.location || "Location not added"}
                </p>

                <div className="worker-details-badges">
                  <span>
                    <CheckCircle2 size={16} />
                    {worker.availability
                      ? "Available for Work"
                      : "Currently Unavailable"}
                  </span>

                  {worker.isVerified && (
                    <span>
                      <ShieldCheck size={16} />
                      Verified Professional
                    </span>
                  )}
                </div>

<div className="worker-save-container">
  <button
    type="button"
    className={`worker-save-button ${isSaved ? "saved" : ""}`}
    onClick={handleSaveWorker}
    disabled={savingWorker}
    aria-pressed={isSaved}
  >
    <Heart
      size={20}
      fill={isSaved ? "currentColor" : "none"}
    />
    {savingWorker
      ? "Please wait..."
      : isSaved
      ? "Saved Worker"
      : "Save Worker"}
  </button>

  {saveError && (
    <p className="worker-save-error" role="alert">
      {saveError}
    </p>
  )}
</div>

              </div>
            </section>

            <div className="worker-details-layout">
              <section className="worker-details-card">
                <h2>
                  <Wrench size={22} />
                  Skills & Services
                </h2>

                <p>
                  Explore the professional services
                  offered by {worker.name}.
                </p>

                <div className="worker-details-skills">
                  {worker.skills?.length > 0 ? (
                    worker.skills.map((skill, index) => (
                      <span key={`${skill}-${index}`}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p>No skills added yet.</p>
                  )}
                </div>
              </section>

              <aside className="worker-details-sidebar">
                <div className="worker-details-card">
                  <h2>Professional Overview</h2>

                  <div className="worker-details-info">
                    <BriefcaseBusiness size={20} />
                    <div>
                      <strong>
                        {worker.experience ?? 0} years
                      </strong>
                      <span>Professional Experience</span>
                    </div>
                  </div>

                  <div className="worker-details-info">
                    <MapPin size={20} />
                    <div>
                      <strong>
                        {worker.location || "Not specified"}
                      </strong>
                      <span>Service Location</span>
                    </div>
                  </div>

                  <div className="worker-details-info">
                    <CalendarDays size={20} />
                    <div>
                      <strong>
                        {worker.availability
                          ? "Accepting Requests"
                          : "Not Available"}
                      </strong>
                      <span>Current Availability</span>
                    </div>
                  </div>


                 


{worker.availability ? (
  <button
    type="button"
    className="worker-details-request"
    onClick={() => {
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(
        sessionStorage.getItem("user") || "null"
      );

      if (!token || !user) {
        navigate("/login");
        return;
      }

      if (user.role !== "customer") {
        alert("Only customers can request services.");
        return;
      }

      setShowRequestForm(true);
    }}
  >
    Request Service
  </button>
) : (
  <button
    type="button"
    className="worker-details-request"
    disabled
  >
    Currently Unavailable
  </button>
)}

           
                </div>
              </aside>
            </div>

{/* CUSTOMER REVIEWS SECTION */}
<section className="worker-details-card worker-reviews-section">
  <h2>
    <Star size={22} />
    Customer Reviews
  </h2>

  {reviewsLoading ? (
    <p>Loading customer reviews...</p>
  ) : reviewsError ? (
    <p role="alert">{reviewsError}</p>
  ) : (
    <>
      <div className="worker-rating-summary">
        <Star size={28} fill="currentColor" />
        <strong>
          {reviews.length > 0
            ? averageRating.toFixed(1)
            : "No ratings yet"}
        </strong>
        <span>
          {reviews.length}{" "}
          {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      {reviews.length === 0 ? (
        <p>
          This professional hasn't received any reviews yet.
        </p>
      ) : (
        <div className="worker-reviews-list">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="worker-review-card"
            >
              <div className="worker-review-header">
                <strong>
                  {review.customer?.name || "Customer"}
                </strong>

                <span>
                  {Array.from(
                    { length: 5 },
                    (_, index) => (
                      <Star
                        key={index}
                        size={17}
                        fill={
                          index < review.rating
                            ? "currentColor"
                            : "none"
                        }
                      />
                    )
                  )}
                </span>
              </div>

              {review.comment && (
                <p>{review.comment}</p>
              )}

              <small>
                {new Date(
                  review.createdAt
                ).toLocaleDateString("en-IN")}
              </small>
            </article>
          ))}
        </div>
      )}
    </>
  )}
</section>

            {showRequestForm && (
              <section
                className="worker-details-booking"
                id="request-service-form"
              >
                <RequestServiceForm
                  worker={worker}
                  onClose={() => setShowRequestForm(false)}
                />
              </section>
            )}
          </>

        ) : (
          <div className="worker-details-message">
            Worker not found.
          </div>
        )}
      </div>
    </main>
  );
}

export default WorkerDetails;
