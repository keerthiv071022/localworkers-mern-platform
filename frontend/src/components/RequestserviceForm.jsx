
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CalendarDays, MapPin, Send, X } from "lucide-react";
import "./RequestServiceForm.css";

function RequestServiceForm({ worker, onClose }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    service: worker.skills?.[0] || "",
    description: "",
    location: "",
    preferredDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");

      const preferredDate = new Date(
        `${formData.preferredDate}T12:00:00`
      ).toISOString();

      await axios.post(
        "http://localhost:5000/api/requests",
        {
          workerId: worker._id,
          service: formData.service,
          description: formData.description,
          location: formData.location,
          preferredDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="request-form-card">
        <div className="request-form-success">
          <h2>Request Submitted!</h2>
          <p>
            Your service request has been sent to
            {` ${worker.name}`}. You can track its
            status from your dashboard.
          </p>

          <button
            type="button"
            className="request-form-submit"
            onClick={() => navigate("/customer/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="request-form-card">
      <div className="request-form-header">
        <div>
          <h2>Request a Service</h2>
          <p>
            Send a service request to {worker.name}.
          </p>
        </div>

        <button
          type="button"
          className="request-form-close"
          onClick={onClose}
          aria-label="Close request form"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <p className="request-form-error" role="alert">
            {error}
          </p>
        )}

        <div className="request-form-field">
          <label htmlFor="request-service">Service</label>
          <select
            id="request-service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            {(worker.skills || []).map((skill, index) => (
              <option key={`${skill}-${index}`} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div className="request-form-field">
          <label htmlFor="request-description">
            Describe Your Requirement
          </label>
          <textarea
            id="request-description"
            name="description"
            rows="4"
            placeholder="Explain the work you need..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="request-form-field">
          <label htmlFor="request-location">
            Service Location
          </label>
          <div className="request-form-input">
            <MapPin size={18} />
            <input
              id="request-location"
              name="location"
              placeholder="Enter the service address or area"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="request-form-field">
          <label htmlFor="request-date">
            Preferred Date
          </label>
          <div className="request-form-input">
            <CalendarDays size={18} />
            <input
              id="request-date"
              type="date"
              name="preferredDate"
              min={localToday}
              value={formData.preferredDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="request-form-submit"
          disabled={loading}
        >
          <Send size={18} />
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

export default RequestServiceForm;
