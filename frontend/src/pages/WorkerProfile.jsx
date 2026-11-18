
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserRound,
  Phone,
  MapPin,
  Wrench,
  BriefcaseBusiness,
  Save,
  ArrowLeft,
} from "lucide-react";
import "./WorkerProfile.css";

const API_URL = "http://localhost:5000/api/workers/profile";

function WorkerProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    skills: "",
    experience: "",
    availability: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const worker = response.data.worker;

        setFormData({
          name: worker.name || "",
          phone: worker.phone || "",
          location: worker.location || "",
          skills: (worker.skills || []).join(", "),
          experience: worker.experience ?? "",
          availability: worker.availability ?? true,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (saving) return;

    const experience = Number(formData.experience);

    if (
      formData.experience === "" ||
      !Number.isFinite(experience) ||
      experience < 0
    ) {
      setError("Please enter valid years of experience.");
      return;
    }

    setSaving(true);

    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.put(
        API_URL,
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          experience,
          availability: formData.availability,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const savedWorker = response.data.worker;

      // Update the locally displayed user name.
      const storedUser = JSON.parse(
        sessionStorage.getItem("user") || "null"
      );

      if (storedUser) {
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            name: savedWorker.name,
          })
        );
      }

      setSuccess("Your profile has been saved successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="worker-profile-page">
        <p className="worker-profile-status">
          Loading your professional profile...
        </p>
      </main>
    );
  }

  return (
    <main className="worker-profile-page">
      <div className="worker-profile-container">
        <button
          type="button"
          className="worker-profile-back"
          onClick={() => navigate("/worker/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="worker-profile-heading">
          <span>PROFESSIONAL PROFILE</span>
          <h1>Build your professional presence</h1>
          <p>
            Keep your information updated so customers
            can discover your services.
          </p>
        </div>

        <form
          className="worker-profile-card"
          onSubmit={handleSubmit}
        >
          {error && (
            <p className="worker-profile-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="worker-profile-success" role="status">
              {success}
            </p>
          )}

          <div className="worker-profile-grid">
            <div className="worker-profile-field">
              <label htmlFor="worker-name">
                Full Name
              </label>
              <div className="worker-profile-input">
                <UserRound size={19} />
                <input
                  id="worker-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="worker-profile-field">
              <label htmlFor="worker-phone">
                Phone Number
              </label>
              <div className="worker-profile-input">
                <Phone size={19} />
                <input
                  id="worker-phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="worker-profile-field">
              <label htmlFor="worker-location">
                Location
              </label>
              <div className="worker-profile-input">
                <MapPin size={19} />
                <input
                  id="worker-location"
                  name="location"
                  placeholder="e.g. Kochi, Kerala"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="worker-profile-field">
              <label htmlFor="worker-experience">
                Years of Experience
              </label>
              <div className="worker-profile-input">
                <BriefcaseBusiness size={19} />
                <input
                  id="worker-experience"
                  type="number"
                  name="experience"
                  min="0"
                  step="0.5"
                  placeholder="e.g. 3"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="worker-profile-field worker-profile-wide">
              <label htmlFor="worker-skills">
                Skills / Services
              </label>
              <div className="worker-profile-input">
                <Wrench size={19} />
                <input
                  id="worker-skills"
                  name="skills"
                  placeholder="e.g. Plumbing, Pipe Repair"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
              </div>
              <small>
                Separate multiple skills with commas.
              </small>
            </div>
          </div>

          <div className="worker-availability">
            <div>
              <h3>Available for Work</h3>
              <p>
                Let customers know whether you're
                currently accepting service requests.
              </p>
            </div>

            <label className="worker-switch">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                aria-label="Available for work"
              />
              <span className="worker-switch-slider" />
            </label>
          </div>

          <button
            type="submit"
            className="worker-profile-save"
            disabled={saving}
          >
            <Save size={19} />
            {saving ? "Saving Profile..." : "Save Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default WorkerProfile;
