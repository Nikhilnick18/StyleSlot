import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import salons from "../data/salons";
import "./SalonDetails.css";

function getSalonStatus(salon) {
  const now = new Date();

  const [openHour, openMinute] = salon.openingTime
    .match(/(\d+):(\d+)/)
    .slice(1)
    .map(Number);

  const [closeHour, closeMinute] = salon.closingTime
    .match(/(\d+):(\d+)/)
    .slice(1)
    .map(Number);

  const openingPeriod = salon.openingTime.slice(-2);
  const closingPeriod = salon.closingTime.slice(-2);

  const open24 =
    (openHour % 12) + (openingPeriod === "PM" ? 12 : 0);

  const close24 =
    (closeHour % 12) + (closingPeriod === "PM" ? 12 : 0);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openingMinutes = open24 * 60 + openMinute;
  const closingMinutes = close24 * 60 + closeMinute;

  return (
    currentMinutes >= openingMinutes &&
    currentMinutes < closingMinutes
  );
}

function SalonDetails() {
  const { slug } = useParams();

  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const salon = salons.find((item) => item.slug === slug);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (!salon) {
    return (
      <div className="salon-not-found">
        <h2>Salon not found</h2>
        <p>The salon you're looking for doesn't exist.</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const isBarber = salon.category?.toLowerCase() === "barber";

  const isOpen = getSalonStatus(salon);

  const galleryImages = isBarber
    ? [
        salon.image,
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85",
      ].filter(Boolean)
    : [
        salon.image,
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=900&q=85",
      ].filter(Boolean);

  // SERVICE SELECTION
  const toggleService = (service) => {
    setSelectedServices((current) => {
      const alreadySelected = current.some(
        (item) => item.name === service.name
      );

      if (alreadySelected) {
        return current.filter(
          (item) => item.name !== service.name
        );
      }

      return [...current, service];
    });
  };

  // TOTAL PRICE
  const totalPrice = selectedServices.reduce(
    (total, service) => total + service.price,
    0
  );

  // TOTAL DURATION
  const totalDuration = selectedServices.reduce(
    (total, service) => total + service.duration,
    0
  );

  // BOOKING DATA
  const bookingState = {
    salonSlug: salon.slug,
    salonName: salon.name,
    selectedServices,
    totalPrice,
    totalDuration,
  };

  const showPreviousImage = () => {
    setActiveImageIndex((current) =>
      (current - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const showNextImage = () => {
    setActiveImageIndex(
      (current) => (current + 1) % galleryImages.length
    );
  };

  return (
    <div className="salon-details-page">

      {/* NAVBAR */}
      <nav className="details-navbar">
        <Link to="/" className="details-logo">
          StyleSlot<span>.</span>
        </Link>

        <Link to="/" className="back-home">
          ← Back to salons
        </Link>
      </nav>

      {/* HERO */}
      <section className="details-hero">
        <div className="details-hero-image">
          <img src={salon.image} alt={salon.name} />
          <span className="hero-image-label">STYLESLOT SELECT</span>
        </div>

        <div className="details-hero-content">
          <div className="details-meta">
            <span className="details-category">{salon.category}</span>
            <span className="demo-label">Demo listing</span>
          </div>

          <h1>{salon.name}</h1>

          <p className="details-location">
            <span>📍</span> {salon.location}
          </p>

          <div className="details-rating">
            <span>★ {salon.rating}</span>
            <small>Sample rating</small>
          </div>

          <p className="details-description">
            Discover professional grooming and styling services
            in a comfortable and welcoming space. Explore the
            menu and find a service that suits your style.
          </p>

          <div className="details-price">
            <div>
              <span>STARTING FROM</span>
              <h2>₹{salon.startingPrice}</h2>
            </div>
            <small>Sample starting price</small>
          </div>

          <div className="details-hero-buttons">
            <a href="#services" className="explore-btn">
              Explore Services
            </a>

            <Link
              to={`/booking/${salon.slug}`}
              state={bookingState}
              className="book-now-btn"
            >
              Book Appointment <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* OPENING HOURS */}
      <section className="salon-hours-section">
        <div className="salon-hours-card">
          <div className="salon-hours-icon">◷</div>

          <div className="salon-hours-info">
            <p className="eyebrow">VISIT US</p>
            <h2>Opening hours</h2>
            <p>
              {salon.openingDays}
            </p>
            <strong>
              {salon.openingTime} – {salon.closingTime}
            </strong>
          </div>

          <span
            className={`salon-live-status ${
              isOpen ? "salon-open" : "salon-closed"
            }`}
          >
            <span className="status-dot"></span>
            {isOpen ? "Open now" : "Closed now"}
          </span>
        </div>

        <p className="salon-hours-note">
          Opening hours are illustrative demo timings and may
          differ from actual salon hours.
        </p>
      </section>

      {/* GALLERY */}
      <section className="details-gallery">
        <div className="details-gallery-heading">
          <div>
            <p className="eyebrow">A CLOSER LOOK</p>
            <h2>Inside the experience.</h2>
          </div>

          <span>
            01 — {String(galleryImages.length).padStart(2, "0")}
          </span>
        </div>

        <div className="details-gallery-grid">
          {galleryImages.map((image, index) => (
            <div
              className={`details-gallery-item gallery-item-${index + 1}`}
              key={`${image}-${index}`}
              role="button"
              tabIndex={0}
              aria-label={`View salon image ${index + 1}`}
              onClick={() => setActiveImageIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveImageIndex(index);
                }
              }}
            >
              <img
                src={image}
                alt={`${salon.category} salon visual ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <p className="details-gallery-note">
          Illustrative category-based images. These are not verified
          photographs of this individual salon.
        </p>
      </section>

      {/* IMAGE LIGHTBOX */}
      {activeImageIndex !== null && (
        <div
          className="gallery-lightbox"
          onClick={() => setActiveImageIndex(null)}
        >
          <button
            className="lightbox-close"
            onClick={() => setActiveImageIndex(null)}
            aria-label="Close gallery"
          >
            &times;
          </button>

          <button
            className="lightbox-prev"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousImage();
            }}
          >
            &#10094;
          </button>

          <img
            className="lightbox-image"
            src={galleryImages[activeImageIndex]}
            alt={`${salon.name} image ${activeImageIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
          />

          <button
            className="lightbox-next"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              showNextImage();
            }}
          >
            &#10095;
          </button>

          <span className="lightbox-counter">
            {String(activeImageIndex + 1).padStart(2, "0")} /{" "}
            {String(galleryImages.length).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* ABOUT */}
      <section className="details-about">
        <div className="details-section-heading">
          <p className="eyebrow">GET TO KNOW US</p>
          <h2>About the salon</h2>
        </div>

        <div className="details-about-content">
          <p>
            {salon.name} is listed on StyleSlot as a{" "}
            {salon.category?.toLowerCase()} option in {salon.area}.
            Explore the available services and choose a convenient
            appointment time.
          </p>

          <div className="details-info-grid">
            <div className="details-info-card">
              <span>LOCATION</span>
              <h3>{salon.area}</h3>
            </div>

            <div className="details-info-card">
              <span>SALON TYPE</span>
              <h3>{salon.category}</h3>
            </div>

            <div className="details-info-card">
              <span>SERVICES</span>
              <h3>{salon.services?.length || 0} Services</h3>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE SELECTION */}
      <section className="details-services" id="services">
        <div className="details-section-heading">
          <p className="eyebrow">THE MENU</p>
          <h2>Choose your services</h2>
          <p>
            Select the services you want at {salon.name}.
          </p>
        </div>

        <div className="services-list">
          {salon.services?.length > 0 ? (
            salon.services.map((service, index) => {
              const isSelected = selectedServices.some(
                (item) => item.name === service.name
              );

              return (
                <div
                  className={`service-item ${
                    isSelected ? "service-selected" : ""
                  }`}
                  key={`${service.name}-${index}`}
                >
                  <span className="service-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="service-name">
                    <h3>{service.name}</h3>
                    <p>{service.duration} minutes</p>
                  </div>

                  <div className="service-price-display">
                    ₹{service.price}
                  </div>

                  <button
                    type="button"
                    className={`service-select-btn ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => toggleService(service)}
                  >
                    {isSelected ? "✓ Added" : "+ Add"}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="empty-services">
              Services will be updated soon.
            </p>
          )}
        </div>

        <p className="service-price-note">
          Prices and durations are illustrative demo estimates.
        </p>

        {/* SELECTED SERVICES SUMMARY */}
        <div className="service-summary">
          <div className="service-summary-heading">
            <div>
              <p className="eyebrow">YOUR SELECTION</p>
              <h3>Booking summary</h3>
            </div>

            <span>{selectedServices.length} selected</span>
          </div>

          {selectedServices.length > 0 ? (
            <>
              <div className="selected-service-list">
                {selectedServices.map((service) => (
                  <div
                    className="selected-service-row"
                    key={service.name}
                  >
                    <div>
                      <h4>{service.name}</h4>
                      <span>{service.duration} min</span>
                    </div>

                    <strong>₹{service.price}</strong>

                    <button
                      type="button"
                      onClick={() => toggleService(service)}
                      aria-label={`Remove ${service.name}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              <div className="service-summary-total">
                <div>
                  <span>Total duration</span>
                  <strong>{totalDuration} minutes</strong>
                </div>

                <div>
                  <span>Total amount</span>
                  <strong className="summary-price">
                    ₹{totalPrice}
                  </strong>
                </div>
              </div>

              <Link
                to={`/booking/${salon.slug}`}
                state={bookingState}
                className="service-continue-btn"
              >
                Continue to Booking <span>→</span>
              </Link>
            </>
          ) : (
            <p className="service-empty-selection">
              You haven't selected any services yet.
              Add a service to see your booking total.
            </p>
          )}
        </div>
      </section>

      {/* LOCATION */}
      <section className="details-location-section">
        <div className="details-section-heading">
          <p className="eyebrow">FIND US</p>
          <h2>Our location</h2>
        </div>

        <div className="location-card">
          <div className="location-icon">⌖</div>
          <div>
            <h3>{salon.name}</h3>
            <p>{salon.location}</p>
            <span>{salon.area}</span>
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="details-booking-cta">
        <div className="cta-content">
          <span className="cta-label">YOUR STYLE, YOUR TIME</span>

          <h2>
            A better look
            <br />
            starts with a booking.
          </h2>

          <p>
            Choose your service, pick a convenient time,
            and let {salon.name} take care of the rest.
          </p>

          <Link
            to={`/booking/${salon.slug}`}
            state={bookingState}
            className="cta-book-button"
          >
            Reserve Your Appointment <span>→</span>
          </Link>
        </div>

        <div className="cta-side-text">
          <span>STYLESLOT.</span>
          <p>Good style. Good feeling.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="details-footer">
        <Link to="/" className="details-logo">
          StyleSlot<span>.</span>
        </Link>

        <p>Find your style. Book your slot.</p>

        <small>© 2026 StyleSlot. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default SalonDetails;
