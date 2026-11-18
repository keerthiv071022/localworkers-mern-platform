
import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  BriefcaseBusiness,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (formData.password.length < 8) {
    setError("Password must contain at least 8 characters.");
    return;
  }

  setError("");
  setLoading(true);

  try {
const response = await api.post("/api/auth/register", {
  name: formData.name,
  email: formData.email,
  password: formData.password,
  role: role,
});

    alert(response.data.message);
    navigate("/login");
  } catch (error) {
    setError(
      error.response?.data?.message ||
      "Registration failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};





return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-intro">
          <span className="auth-eyebrow">
            <ShieldCheck size={16} /> JOIN LOCALWORKERS
          </span>
          <h1>
            Get started with <span>LocalWorkers.</span>
          </h1>
          <p>
            Create your account to connect with trusted local
            professionals or grow your service business.
          </p>

          <div className="auth-benefits">
            <div><ShieldCheck size={19} /> Simple, secure registration</div>
            <div><ShieldCheck size={19} /> Find skilled professionals</div>
            <div><ShieldCheck size={19} /> Manage requests in one place</div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create an account</h2>
            <p>Choose how you'd like to use LocalWorkers.</p>
          </div>

          <div className="role-selector">
            <button
              type="button"
              className={`role-option ${role === "customer" ? "selected" : ""}`}
              onClick={() => setRole("customer")}
            >
              <UserRound size={22} />
              <strong>Hire a Worker</strong>
              <span>I'm looking for services</span>
            </button>

            <button
              type="button"
              className={`role-option ${role === "worker" ? "selected" : ""}`}
              onClick={() => setRole("worker")}
            >
              <BriefcaseBusiness size={22} />
              <strong>Offer Services</strong>
              <span>I'm a skilled professional</span>
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                className="form-control"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="register-email"
                  className="form-control"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <div className="auth-input-wrap">
                <LockKeyhole size={18} />
                <input
                  id="register-password"
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-confirm">Confirm Password</label>
              <input
                id="register-confirm"
                className="form-control"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}

           <button
  type="submit"
  className="auth-submit"
  disabled={loading}
>
  {loading ? "Creating Account..." : "Create Account"}
  <ArrowRight size={18} />
</button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
