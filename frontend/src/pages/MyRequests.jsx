
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReviewForm from "../components/reviewForm";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  BriefcaseBusiness,
  ClipboardList,
} from "lucide-react";
import "./myRequests.css";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [reviews, setReviews] = useState([]);
const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/requests/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

const reviewResponse = await axios.get(
  "http://localhost:5000/api/reviews/my",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: controller.signal,
  }
);

if (!controller.signal.aborted) {
  setRequests(response.data.requests || []);
  setReviews(reviewResponse.data.reviews || []);
}
      } catch (err) {
        if (
          err.code !== "ERR_CANCELED" &&
          !controller.signal.aborted
        ) {
          setError(
            err.response?.data?.message ||
              "Unable to load your service requests."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRequests();

    return () => controller.abort();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="my-requests-page">
      <div className="my-requests-container">
        <Link
          to="/customer/dashboard"
          className="my-requests-back"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="my-requests-header">
          <span className="my-requests-eyebrow">
            SERVICE MANAGEMENT
          </span>
          <h1>My Service Requests</h1>
          <p>
            View your bookings and track their progress.
          </p>
        </div>

        {loading ? (
          <div className="my-requests-message">
            Loading your requests...
          </div>
        ) : error ? (
          <div
            className="my-requests-message"
            role="alert"
          >
            {error}
          </div>
        ) : requests.length === 0 ? (
          <div className="my-requests-empty">
            <ClipboardList size={42} />
            <h2>No service requests yet</h2>
            <p>
              Find a skilled local professional and
              submit your first service request.
            </p>
            <Link
              to="/workers"
              className="my-requests-button"
            >
              Find Workers
            </Link>
          </div>
        ) : (
          <div className="my-requests-grid">
            {requests.map((request) => (
              <article
                className="my-requests-card"
                key={request._id}
              >
                <div className="my-requests-card-top">
                  <div>
                    <span className="my-requests-label">
                      SERVICE REQUEST
                    </span>
                    <h2>{request.service}</h2>
                  </div>

                  <span
                    className={`my-requests-status status-${request.status}`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="my-requests-detail">
                  <BriefcaseBusiness size={18} />
                  <span>
                    {request.worker?.name ||
                      "Worker unavailable"}
                  </span>
                </div>

                <div className="my-requests-detail">
                  <MapPin size={18} />
                  <span>{request.location}</span>
                </div>

                <div className="my-requests-detail">
                  <CalendarDays size={18} />
                  <span>
                    Preferred date:{" "}
                    {formatDate(request.preferredDate)}
                  </span>
                </div>

                <div className="my-requests-description">
                  <strong>Job Description</strong>
                  <p>{request.description}</p>
                </div>

                <div className="my-requests-footer">
                  <span>
                    Requested on{" "}
                    {formatDate(request.createdAt)}
                  </span>
                </div>

{request.status === "completed" && (
  <>
    {reviews.some(
      (review) =>
        review.serviceRequest === request._id
    ) ? (
      <p className="my-requests-reviewed">
        ★ Reviewed
      </p>
    ) : reviewingId === request._id ? (
      <ReviewForm
        serviceRequestId={request._id}
        onSuccess={(review) => {
          setReviews((previous) => [...previous, review]);
          setReviewingId(null);
        }}
        onCancel={() => setReviewingId(null)}
      />
    ) : (
      <button
        type="button"
        className="my-requests-button"
        onClick={() => setReviewingId(request._id)}
      >
        Write a Review
      </button>
    )}
  </>
)}

              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyRequests;
