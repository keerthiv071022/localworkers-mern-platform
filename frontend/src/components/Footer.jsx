
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">
                <MapPin size={22} />
              </span>
              <span>
                Local<span>Workers</span>
              </span>
            </Link>

            <p>
              Connecting you with skilled local professionals
              for reliable home services, all in one place.
            </p>

         
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/workers">Find Workers</Link>
            <Link to="/become-worker">Become a Worker</Link>
            <Link to="/about">About Us</Link>
          </div>

          <div className="footer-column">
            <h4>Our Services</h4>
            <Link to="/workers?skill=Electrician">Electricians</Link>
            <Link to="/workers?skill=Plumber">Plumbers</Link>
            <Link to="/workers?skill=Painter">Painters</Link>
            <Link to="/workers?skill=Carpenter">Carpenters</Link>
            <Link to="/workers?skill=Cleaner">Cleaning Services</Link>
          </div>

          <div className="footer-column">
            <h4>Get in Touch</h4>
            <p className="footer-contact">
              <MapPin size={17} />
              Serving local communities
            </p>

            <p className="footer-contact">
              <Mail size={17} />
              Contact details coming soon
            </p>

            <Link to="/register" className="footer-join">
              Join LocalWorkers <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} LocalWorkers. All rights reserved.</p>
          <span>Connecting skills with opportunities.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
