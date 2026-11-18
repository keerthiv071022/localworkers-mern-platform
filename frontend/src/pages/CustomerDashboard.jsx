
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Search,
  ClipboardList,
  CheckCircle2,
  Heart,
  ArrowRight,
} from "lucide-react";
import "./Dashboard.css";

function CustomerDashboard() {
  const user = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [savedWorkersCount, setSavedWorkersCount] = useState(0);
const [savedWorkersLoading, setSavedWorkersLoading] = useState(true);
const [savedWorkersError, setSavedWorkersError] = useState("");
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

      if (!controller.signal.aborted) {
        setRequests(response.data.requests || []);
      }
    } catch (err) {
      if (
        err.code !== "ERR_CANCELED" &&
        !controller.signal.aborted
      ) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard statistics."
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
        setSavedWorkersCount(response.data.count || 0);
      }
    } catch (err) {
      if (
        err.code !== "ERR_CANCELED" &&
        !controller.signal.aborted
      ) {
        setSavedWorkersError(
          err.response?.data?.message ||
            "Unable to load saved workers."
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setSavedWorkersLoading(false);
      }
    }
  };

  fetchSavedWorkers();

  return () => controller.abort();
}, []);

const activeCount = requests.filter(
  (request) =>
    ["pending", "accepted"].includes(request.status)
).length;

const completedCount = requests.filter(
  (request) => request.status === "completed"
).length;

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <span>CUSTOMER DASHBOARD</span>
          <h1>Welcome back, {user?.name || "Customer"}!</h1>
          <p>
            Find trusted professionals and manage your
            service requests in one place.
          </p>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-stat">
            <ClipboardList size={25} />
          <h2>{loading ? "..." : error ? "—" : activeCount}</h2>
<p>Active Requests</p>
          </div>

          <div className="dashboard-stat">
            <CheckCircle2 size={25} />
        <h2>{loading ? "..." : error ? "—" : completedCount}</h2>
<p>Completed Jobs</p>
          </div>

      <div className="dashboard-stat">
  <Heart size={25} />
  <h2>
    {savedWorkersLoading
      ? "..."
      : savedWorkersError
      ? "—"
      : savedWorkersCount}
  </h2>
   <p>Saved Workers</p>
</div>

</div> {/* Closes dashboard-stats */}

{error && (
  <p className="dashboard-message" role="alert">
    {error}
  </p>
)}
{savedWorkersError && (
  <p className="dashboard-message" role="alert">
    {savedWorkersError}
  </p>
)}

        <section className="dashboard-section">
          <h2>Quick Actions</h2>

          <div className="dashboard-actions">
            <Link to="/workers" className="dashboard-action">
              <Search size={26} />
              <h3>Find Workers</h3>
              <p>
                Browse skilled professionals near you.
              </p>
              <span>
                Explore Workers <ArrowRight size={17} />
              </span>
            </Link>

            
<Link
  to="/customer/requests"
  className="dashboard-action"
>
  <ClipboardList size={26} />

  <h3>My Requests</h3>

  <p>
    View your service bookings and track
    their current status.
  </p>

  <span>
    View My Requests <ArrowRight size={17} />
  </span>
</Link>

<Link
  to="/customer/saved-workers"
  className="dashboard-action"
>
  <Heart size={26} />

  <h3>My Saved Workers</h3>

  <p>
    View your favourite professionals and
    quickly access their profiles.
  </p>

  <span>
    View Saved Workers <ArrowRight size={17} />
  </span>
</Link>

          </div>
        </section>
      </div>
    </main>
  );
}

export default CustomerDashboard;
