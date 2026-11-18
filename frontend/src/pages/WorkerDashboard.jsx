
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Star,
  UserRoundPen,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";

import "./Dashboard.css";

const API_URL = "http://localhost:5000/api/requests";
const PROFILE_URL = "http://localhost:5000/api/workers/profile";
const REVIEWS_URL = "http://localhost:5000/api/reviews";

function WorkerDashboard() {
  let user = null;

  try {
    user = JSON.parse(
      sessionStorage.getItem("user") || "null"
    );
  } catch {
    user = null;
  }

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] =
    useState(true);
  const [availabilityError, setAvailabilityError] =
    useState("");

  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [ratingsError, setRatingsError] = useState("");

  // Fetch service requests
  useEffect(() => {
    const controller = new AbortController();

    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (!controller.signal.aborted) {
          setRequests(response.data.requests || []);
          setError("");
        }
      } catch (err) {
        if (
          err.code !== "ERR_CANCELED" &&
          !controller.signal.aborted
        ) {
          setError(
            err.response?.data?.message ||
              "Unable to load service requests."
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

  // Fetch worker availability and average rating
  useEffect(() => {
    const controller = new AbortController();

    const fetchWorkerDetails = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const profileResponse = await axios.get(
          PROFILE_URL,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        const worker = profileResponse.data.worker;

        if (!worker?._id) {
          throw new Error("Worker profile not found");
        }

        setAvailability(worker.availability ?? true);
        setAvailabilityError("");
        setAvailabilityLoading(false);

        try {
          const reviewResponse = await axios.get(
            `${REVIEWS_URL}/worker/${worker._id}`,
            {
              signal: controller.signal,
            }
          );

          if (!controller.signal.aborted) {
            setAverageRating(
              reviewResponse.data.averageRating ?? 0
            );

            setReviewCount(
              reviewResponse.data.count ?? 0
            );

            setRatingsError("");
          }
        } catch (err) {
          if (
            err.code !== "ERR_CANCELED" &&
            !controller.signal.aborted
          ) {
            setRatingsError(
              "Unable to load worker ratings."
            );
          }
        }
      } catch (err) {
        if (
          err.code !== "ERR_CANCELED" &&
          !controller.signal.aborted
        ) {
          setAvailabilityError(
            err.response?.data?.message ||
              "Unable to load availability."
          );

          setRatingsError(
            "Unable to load worker ratings."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false);
          setRatingsLoading(false);
        }
      }
    };

    fetchWorkerDetails();

    return () => controller.abort();
  }, []);

  // Accept, reject or complete a service request
  const updateStatus = async (requestId, status) => {
    if (updatingId !== null) return;

    setUpdatingId(requestId);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.patch(
        `${API_URL}/${requestId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests((previous) =>
        previous.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: response.data.request.status,
              }
            : request
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update request status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Dashboard statistics
  const pendingCount = requests.filter(
    (request) => request.status === "pending"
  ).length;

  const completedCount = requests.filter(
    (request) => request.status === "completed"
  ).length;

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <span>WORKER DASHBOARD</span>

          <h1>
            Welcome back, {user?.name || "Professional"}!
          </h1>

          <p>
            Build your professional presence, manage
            service requests, and connect with customers
            in your area.
          </p>
        </div>

        {/* Dashboard Statistics */}
        <div className="dashboard-stats">

          <div className="dashboard-stat">
            <BriefcaseBusiness size={25} />

            <h2>
              {loading
                ? "..."
                : error
                ? "—"
                : pendingCount}
            </h2>

            <p>New Requests</p>
          </div>

          <div className="dashboard-stat">
            <CheckCircle2 size={25} />

            <h2>
              {loading
                ? "..."
                : error
                ? "—"
                : completedCount}
            </h2>

            <p>Completed Jobs</p>
          </div>

          <div className="dashboard-stat">
            <Star size={25} />

            <h2>
              {ratingsLoading
                ? "..."
                : ratingsError
                ? "—"
                : reviewCount > 0
                ? Number(averageRating).toFixed(1)
                : "—"}
            </h2>

            <p>Average Rating</p>

            {!ratingsLoading &&
              !ratingsError &&
              reviewCount > 0 && (
                <small>
                  Based on {reviewCount}{" "}
                  {reviewCount === 1
                    ? "review"
                    : "reviews"}
                </small>
              )}

            {!ratingsLoading &&
              !ratingsError &&
              reviewCount === 0 && (
                <small>No reviews yet</small>
              )}
          </div>
        </div>

        {/* Manage Work Section */}
        <section className="dashboard-section">
          <h2>Manage Your Work</h2>

          <div className="dashboard-actions">

            <Link
              to="/worker/profile"
              className="dashboard-action"
            >
              <UserRoundPen size={26} />

              <h3>My Professional Profile</h3>

              <p>
                Add your skills, experience, location,
                and contact information.
              </p>

              <span>Edit Profile →</span>
            </Link>

            <a
              href="#worker-requests"
              className="dashboard-action"
            >
              <ClipboardList size={26} />

              <h3>Service Requests</h3>

              <p>
                Review and manage requests received
                from customers.
              </p>

              <span>View Requests →</span>
            </a>

            <Link
              to="/worker/profile"
              className="dashboard-action"
            >
              <CalendarCheck size={26} />

              <h3>Availability</h3>

              <p>
                Update your availability so customers
                know when you're ready to work.
              </p>

              <span>
                {availabilityLoading
                  ? "Checking availability..."
                  : availabilityError
                  ? "Update Availability →"
                  : availability
                  ? "Available for Work — Update →"
                  : "Currently Unavailable — Update →"}
              </span>
            </Link>

          </div>
        </section>

        {/* Service Requests Section */}
        <section
          className="dashboard-section"
          id="worker-requests"
        >
          <h2>Service Requests</h2>

          {error && (
            <p
              role="alert"
              className="dashboard-message"
            >
              {error}
            </p>
          )}

          {loading ? (
            <p className="dashboard-message">
              Loading service requests...
            </p>
          ) : requests.length === 0 ? (
            <p className="dashboard-message">
              No service requests received yet.
            </p>
          ) : (
            <div className="worker-requests-list">
              {requests.map((request) => (
                <article
                  key={request._id}
                  className="worker-request-card"
                >
                  <div className="worker-request-header">
                    <div>
                      <h3>{request.service}</h3>

                      <p>
                        Customer:{" "}
                        {request.customer?.name ||
                          "Customer"}
                      </p>
                    </div>

                    <span
                      className={`worker-request-status status-${request.status}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <p>{request.description}</p>

                  <div className="worker-request-meta">
                    <span>
                      Location: {request.location}
                    </span>

                    <span>
                      Preferred Date:{" "}
                      {new Date(
                        request.preferredDate
                      ).toLocaleDateString("en-IN")}
                    </span>
                  </div>

                  {/* Pending Requests */}
                  {request.status === "pending" && (
                    <div className="worker-request-actions">
                      <button
                        type="button"
                        className="worker-accept-btn"
                        disabled={updatingId !== null}
                        onClick={() =>
                          updateStatus(
                            request._id,
                            "accepted"
                          )
                        }
                      >
                        {updatingId === request._id
                          ? "Updating..."
                          : "Accept"}
                      </button>

                      <button
                        type="button"
                        className="worker-reject-btn"
                        disabled={updatingId !== null}
                        onClick={() =>
                          updateStatus(
                            request._id,
                            "rejected"
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Accepted Requests */}
                  {request.status === "accepted" && (
                    <div className="worker-request-actions">
                      <button
                        type="button"
                        className="worker-accept-btn"
                        disabled={updatingId !== null}
                        onClick={() =>
                          updateStatus(
                            request._id,
                            "completed"
                          )
                        }
                      >
                        {updatingId === request._id
                          ? "Updating..."
                          : "Mark as Completed"}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default WorkerDashboard;
