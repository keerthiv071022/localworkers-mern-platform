
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  MapPin,
  Menu,
  UserRound,
  LogOut,
} from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Read logged-in user information
  const token = sessionStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      sessionStorage.getItem("user") || "null"
    );
  } catch {
    user = null;
  }

  const isLoggedIn = Boolean(token && user);

  const dashboardPath =
    user?.role === "worker"
      ? "/worker/dashboard"
      : "/customer/dashboard";

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    closeMenu();
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="logo-icon">
            <MapPin size={22} />
          </span>
          <span>
            Local<span>Workers</span>
          </span>
        </Link>

        <nav
          className={`navbar-links ${
            menuOpen ? "menu-open" : ""
          }`}
        >
          <Link
            to="/"
            className={
              location.pathname === "/" ? "active" : ""
            }
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/workers"
            className={
              location.pathname === "/workers"
                ? "active"
                : ""
            }
            onClick={closeMenu}
          >
            Find Workers
          </Link>

          {!isLoggedIn && (
            <Link
              to="/become-worker"
              onClick={closeMenu}
            >
              Become a Worker
            </Link>
          )}

          <Link
            to="/about"
            onClick={closeMenu}
          >
            About Us
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to={dashboardPath}
                className={`mobile-nav-login ${
                  location.pathname === dashboardPath
                    ? "active"
                    : ""
                }`}
                onClick={closeMenu}
              >
                <UserRound size={17} />
                {user?.name || "My Account"}
              </Link>

              <button
                type="button"
                className="mobile-nav-register"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="mobile-nav-login"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="mobile-nav-register"
                onClick={closeMenu}
              >
                Get Started
              </Link>
            </>
          )}
        </nav>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <Link
                to={dashboardPath}
                className="login-link"
              >
                <UserRound size={17} />
                <span>
                  {user?.name || "My Account"}
                </span>
              </Link>

              <button
                type="button"
                className="navbar-cta"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="login-link"
              >
                <UserRound size={17} />
                Login
              </Link>

              <Link
                to="/register"
                className="navbar-cta"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="mobile-menu"
          aria-label={
            menuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={25} />
        </button>

      </div>
    </header>
  );
}

export default Navbar;
