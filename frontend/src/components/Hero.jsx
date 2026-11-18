import { useState } from "react";
import { Search, MapPin, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import "./Hero.css";

function Hero() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
      skill: service,
      location: location,
    });

    window.location.href = `/workers?${params.toString()}`;
  };

  return (
    <section className="hero">
      <div className="hero-container">

        <div className="hero-content">

          <span className="hero-tag">
            <ShieldCheck size={16} />
            Trusted local professionals
          </span>

          <h1>
            Find the right help.
            <span> Right in your neighbourhood.</span>
          </h1>

          <p className="hero-description">
            From everyday repairs to home improvements, connect
            with skilled professionals you can trust.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>

            <div className="search-field">
              <Search size={21} />
              <div>
                <label>What service do you need?</label>
                <input
                  type="text"
                  placeholder="e.g. Electrician, Plumber"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                />
              </div>
            </div>

            <div className="search-divider"></div>

            <div className="search-field">
              <MapPin size={21} />
              <div>
                <label>Your location</label>
                <input
                  type="text"
                  placeholder="Enter your city or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="hero-search-btn">
              <Search size={19} />
              Search
            </button>

          </form>

          <div className="hero-trust">

            <div>
              <ShieldCheck size={18} />
              <span>Verified professionals</span>
            </div>

            <div>
              <Clock size={18} />
              <span>Quick connections</span>
            </div>

          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-visual-main">
            <div className="visual-top-label">
              <span className="visual-dot"></span>
              PROFESSIONAL HOME SERVICES
            </div>

            
<div className="visual-illustration">
  <img
    src="/images/hero.jpg"
    alt="Professional home service technician"
    className="hero-worker-image"
  />
</div>


            <div className="visual-bottom">
              <div>
                <h3>Help is closer than you think.</h3>
                <p>Skilled people. Reliable services.</p>
              </div>
              <div className="visual-arrow">
                <ArrowRight size={22} />
              </div>
            </div>
          </div>

          <div className="hero-floating-card">
            <div className="floating-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <strong>Find trusted help</strong>
              <p>All in one place</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;