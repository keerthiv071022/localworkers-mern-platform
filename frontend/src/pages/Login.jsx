
import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import "./Register.css";

function Login() {
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  setError("");
  setLoading(true);

  try {
 const response = await api.post("/api/auth/login", {
  email: formData.email,
  password: formData.password,
});

    const { token, user } = response.data;

    // Temporary session storage for this development stage
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));

    alert(`Welcome back, ${user.name}!`);

   if (user.role === "customer") {
  navigate("/customer/dashboard");
} else if (user.role === "worker") {
  navigate("/worker/dashboard");
} else {
  navigate("/");
}
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to log in. Please try again."
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
            <ShieldCheck size={16} />
            WELCOME BACK
          </span>

          <h1>
            Your local help is <span>just a click away.</span>
          </h1>

          <p>
            Sign in to manage your service requests,
            connect with skilled professionals,
            and stay updated.
          </p>

          <div className="auth-benefits">
            <div>
              <ShieldCheck size={19} />
              Manage your service requests
            </div>
            <div>
              <ShieldCheck size={19} />
              Connect with trusted professionals
            </div>
            <div>
              <ShieldCheck size={19} />
              Keep track of your bookings
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Enter your credentials to access your account.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>

              <div className="auth-input-wrap">
                <Mail size={18} />

                <input
                  id="login-email"
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
              <label htmlFor="login-password">Password</label>

              <div className="auth-input-wrap">
                <LockKeyhole size={18} />

                <input
                  id="login-password"
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

          {error && (
  <p className="auth-error" role="alert">
    {error}
  </p>
)}

<button
  type="submit"
  className="auth-submit"
  disabled={loading}
>
  {loading ? "Signing In..." : "Sign In"}
  <ArrowRight size={18} />
</button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;