import {
  Zap,
  Droplets,
  Paintbrush,
  Hammer,
  Sparkles,
  Wind,
  ArrowUpRight,
} from "lucide-react";

import "./Services.css";

const services = [
  {
    name: "Electricians",
    description: "Electrical repairs & installations",
    icon: Zap,
  },
  {
    name: "Plumbers",
    description: "Pipes, taps & water systems",
    icon: Droplets,
  },
  {
    name: "Painters",
    description: "Interior & exterior painting",
    icon: Paintbrush,
  },
  {
    name: "Carpenters",
    description: "Furniture & woodwork",
    icon: Hammer,
  },
  {
    name: "Cleaners",
    description: "Home & office cleaning",
    icon: Sparkles,
  },
  {
    name: "AC Technicians",
    description: "AC repair & maintenance",
    icon: Wind,
  },
];

function Services() {
  return (
    <section className="services-section">
      <div className="container">

        <div className="services-heading">
          <div>
            <span className="section-eyebrow">OUR SERVICES</span>
            <h2>What can we help you with?</h2>
            <p>
              Find experienced professionals for your everyday
              home service needs.
            </p>
          </div>

          <a href="/workers" className="services-view-all">
            Explore all services
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="services-grid">

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <a
                href={`/workers?skill=${encodeURIComponent(service.name)}`}
                className="service-card"
                key={service.name}
              >
                <div className="service-icon">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                <div className="service-info">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>

                <ArrowUpRight
                  size={19}
                  className="service-arrow"
                />
              </a>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default Services;