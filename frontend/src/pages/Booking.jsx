import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import salons from "../data/salons";
import "./Booking.css";

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",

];

function Booking() {
  const { slug } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const salon = salons.find((item) => item.slug === slug);

  const availableServices = (salon?.services || []).map((service) =>
    typeof service === "string"
      ? {
          name: service,
          price: Number(salon.startingPrice) || 0,
          duration: 30,
        }
      : service
  );

  const [selectedServices, setSelectedServices] = useState(() => {
    const passedServices = location.state?.selectedServices;

    if (!Array.isArray(passedServices)) return [];

    const selectedNames = new Set(
      passedServices.map((service) => service?.name)
    );

    return availableServices.filter((service) =>
      selectedNames.has(service.name)
    );
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const paymentMethod = "pay_at_salon";

  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [bookingError, setBookingError] = useState("");

  if (!salon) {
    return (
      <main className="booking-page">
        <div className="booking-empty">
          <h1>Salon not found</h1>
          <p>We couldn't find this salon.</p>
          <Link to="/">Back to StyleSlot</Link>
        </div>
      </main>
    );
  }

  // TOTAL PRICE
  const totalPrice = selectedServices.reduce(
    (total, service) => total + Number(service.price || 0),
    0
  );

  // TOTAL DURATION
  const totalDuration = selectedServices.reduce(
    (total, service) => total + Number(service.duration || 0),
    0
  );

  // TODAY'S DATE
  const today = new Date();

  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // MAXIMUM BOOKING DATE: 30 DAYS
  const maxDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  maxDate.setDate(maxDate.getDate() + 30);

  const maxBookingDate = [
    maxDate.getFullYear(),
    String(maxDate.getMonth() + 1).padStart(2, "0"),
    String(maxDate.getDate()).padStart(2, "0"),
  ].join("-");

  // CHECK TIME SLOT
  function isTimeUnavailable(time) {
    if (!selectedDate) return true;

    if (selectedDate !== localToday) return false;

    const now = new Date();
    const [clock, period] = time.split(" ");

    let [hours, minutes] = clock.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const slotMinutes = hours * 60 + minutes;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return slotMinutes <= currentMinutes;
  }

  // TOGGLE SERVICE
  function toggleService(service) {
    setSelectedServices((current) =>
      current.some((item) => item.name === service.name)
        ? current.filter((item) => item.name !== service.name)
        : [...current, service]
    );
  }

  // HANDLE BOOKING FORM
  function handleBooking(event) {
    event.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert("Please choose an appointment date and time.");
      return;
    }

    if (selectedDate < localToday || selectedDate > maxBookingDate) {
      alert("Please choose a date within the next 30 days.");
      return;
    }

    if (isTimeUnavailable(selectedTime)) {
      alert("This time slot has already passed. Please choose another time.");
      return;
    }

    if (customerName.trim().length < 2) {
      alert("Please enter your full name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(customerPhone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setBookingError("");
    setConfirmed(true);
  }

  // SAVE BOOKING TO FIRESTORE
  async function handleConfirmBooking() {
    setBookingError("");

    if (!user) {
      setBookingError(
        "Please sign in before confirming your appointment."
      );
      return;
    }

    setSaving(true);

    try {
       const bookingRef = await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userEmail: user.email || "",

        salonName: salon.name,
        salonSlug: salon.slug,
        salonLocation: salon.location,

        customerName: customerName.trim(),
        customerPhone,

        date: selectedDate,
        time: selectedTime,

        services: selectedServices.map((service) => ({
          name: service.name,
          price: service.price,
          duration: service.duration,
        })),

        serviceSelection:
          selectedServices.length > 0
            ? "selected"
            : "decide_at_salon",

        totalDuration,
        totalPrice,

        paymentMethod,
        paymentStatus: "unpaid",
        status: "pending",

        createdAt: serverTimestamp(),
      });

      setBookingId(bookingRef.id);
      setSaved(true);
    } catch (error) {
      console.error("Booking save failed:", error);

      setBookingError(
        error.code === "permission-denied"
          ? "Permission denied. Please check your Firestore security rules and make sure you are signed in."
          : "We couldn't save your booking. Please check your connection and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  // THANK YOU PAGE
  if (saved) {
    return (
      <main className="booking-page">
        <header className="booking-header">
          <Link to="/" className="booking-brand">
            style<span>slot.</span>
          </Link>
          <span className="booking-header-note">
            YOUR STYLE, YOUR TIME
          </span>
        </header>

        <div className="thankyou-container">
          <div className="thankyou-card">
            <div className="thankyou-icon">✓</div>

            <p className="booking-eyebrow">
              BOOKING REQUEST RECEIVED
            </p>

            <h1>You're All Set!</h1>
            <h2>Thank You for Choosing StyleSlot.</h2>

            <p className="thankyou-message">
              A little self-care, a fresh look, and some time
              just for you. Your appointment request has been
              successfully received!
            </p>

            <div className="thankyou-details">
              <h3>Your Appointment Details</h3>
              <p><strong>Salon:</strong> {salon.name}</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Booking ID:</strong> {bookingId}</p>
              <p><strong>Amount:</strong> ₹{totalPrice || "To be confirmed"}</p>
              <p><strong>Status:</strong> Pending approval</p>
            </div>

            <p className="thankyou-note">
              The salon will review your request and update
              your appointment status.
            </p>

            <Link
              to="/my-bookings"
              className="booking-primary-button"
            >
              View My Appointments ↗
            </Link>

            <Link to="/" className="booking-home-link">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // THANK YOU SCREEN - SHOW ONLY AFTER FIRESTORE SAVE SUCCEEDS
  if (saved) {
    return (
      <main className="booking-page">
        <header className="booking-header">
          <Link to="/" className="booking-brand">
            style<span>slot.</span>
          </Link>

          <span className="booking-header-note">
            YOUR STYLE, YOUR TIME
          </span>
        </header>

        <div className="thankyou-container">
          <div className="thankyou-card">
            <div className="thankyou-icon" aria-hidden="true">
              ✓
            </div>

            <p className="booking-eyebrow">
              BOOKING REQUEST RECEIVED
            </p>

            <h1>You're All Set!</h1>

            <h2>Thank You for Choosing StyleSlot.</h2>

            <p className="thankyou-message">
              A little self-care, a fresh look, and some time just for you.
              Your appointment request is on its way!
            </p>

            <div className="thankyou-details">
              <h3>Your appointment at a glance</h3>

              <p><strong>Salon:</strong> {salon.name}</p>
              <p><strong>Location:</strong> {salon.location}</p>
              <p><strong>Customer:</strong> {customerName.trim()}</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p className="thankyou-booking-id">
                <strong>Booking ID:</strong> {bookingId}
              </p>
              <p><strong>Status:</strong> Pending approval</p>
              <p><strong>Payment:</strong> Pay at Salon</p>
              <p>
                <strong>Estimated total:</strong>{" "}
                {selectedServices.length > 0
                  ? `₹${totalPrice}`
                  : "To be confirmed at the salon"}
              </p>
            </div>

            <p className="thankyou-note">
              Your request has been saved successfully. The appointment
              will be confirmed once the salon approves it.
            </p>

            <Link to="/my-bookings" className="booking-primary-button">
              View My Appointments ↗
            </Link>

            <Link to="/" className="booking-home-link">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // BOOKING CONFIRMATION
  if (confirmed) {
    return (
      <main className="booking-page">
        <header className="booking-header">
          <Link to="/" className="booking-brand">
            style<span>slot.</span>
          </Link>

          <span className="booking-header-note">
            YOUR STYLE, YOUR TIME
          </span>
        </header>

        <div className="booking-success">
          <div className="success-mark">✓</div>

          <p className="booking-eyebrow">
            {saved ? "BOOKING SAVED" : "REVIEW YOUR BOOKING"}
          </p>

          <h1>
            {saved
              ? "Your booking is saved."
              : "Your appointment details."}
          </h1>

          <p>
            {saved
              ? "Your appointment request has been saved to StyleSlot. The salon has not yet confirmed it."
              : "Review your selections below, then confirm to save your appointment request."}
          </p>

          <div className="success-summary">
            <p>
              <strong>Salon:</strong> {salon.name}
            </p>

            <p>
              <strong>Location:</strong> {salon.location}
            </p>

            <p>
              <strong>Customer:</strong> {customerName.trim()}
            </p>

            <p>
              <strong>Mobile:</strong> {customerPhone}
            </p>

            <p>
              <strong>Date:</strong> {selectedDate}
            </p>

            <p>
              <strong>Time:</strong> {selectedTime}
            </p>

            <p>
              <strong>Payment:</strong> Pay at Salon
            </p>

            <p>
              <strong>Payment status:</strong>{" "}
              {saved ? "Unpaid" : "Due at salon"}
            </p>

            <p>
              <strong>Services:</strong>
            </p>

            {selectedServices.length > 0 ? (
              selectedServices.map((service) => (
                <p key={service.name}>
                  {service.name} — ₹{service.price} (
                  {service.duration} min)
                </p>
              ))
            ) : (
              <p>To be decided at the salon</p>
            )}

            <p>
              <strong>Total duration:</strong>{" "}
              {selectedServices.length > 0
                ? `${totalDuration} minutes`
                : "To be confirmed"}
            </p>

            <p>
              <strong>Estimated total:</strong>{" "}
              {selectedServices.length > 0
                ? `₹${totalPrice}`
                : "To be confirmed"}
            </p>
          </div>

          {bookingError && (
            <p role="alert" className="booking-disclaimer">
              {bookingError}

              {!user && (
                <>
                  {" "}
                  <Link to="/login">Sign in</Link> and then return to book.
                </>
              )}
            </p>
          )}

          {!saved ? (
            <>
              <button
                type="button"
                className="booking-primary-button"
                onClick={handleConfirmBooking}
                disabled={saving}
              >
                {saving ? "Saving booking..." : "Confirm booking ↗"}
              </button>

              <button
                type="button"
                className="booking-home-link"
                onClick={() => {
                  setConfirmed(false);
                  setBookingError("");
                }}
                disabled={saving}
              >
                Edit booking
              </button>
            </>
          ) : (
            <Link
              to="/my-bookings"
              className="booking-primary-button"
            >
              View my appointments ↗
            </Link>
          )}

          <Link to="/" className="booking-home-link">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  // MAIN BOOKING PAGE
  return (
    <main className="booking-page">
      <header className="booking-header">
        <Link to="/" className="booking-brand">
          style<span>slot.</span>
        </Link>

        <span className="booking-header-note">
          YOUR STYLE, YOUR TIME
        </span>
      </header>

      <div className="booking-container">
        <Link
          to={`/salon/${salon.slug}`}
          className="booking-back-link"
        >
          ← Back to salon
        </Link>

        <div className="booking-heading">
          <p className="booking-eyebrow">
            YOUR NEXT LOOK STARTS HERE
          </p>

          <h1>Book your appointment.</h1>

          <p>
            Select your services, choose a date and time, and review
            your total before proceeding.
          </p>
        </div>

        <div className="booking-layout">
          <form className="booking-form" onSubmit={handleBooking}>

            {/* 01 - SERVICES */}
            <section className="booking-section">
              <div className="booking-section-title">
                <span>01</span>

                <div>
                  <h2>Choose your services</h2>
                  <p>
                    Select services now, or decide when you arrive.
                  </p>
                </div>
              </div>

              <div className="booking-services">
                {availableServices.map((service) => {
                  const isSelected = selectedServices.some(
                    (item) => item.name === service.name
                  );

                  return (
                    <button
                      type="button"
                      key={service.name}
                      className={
                        isSelected
                          ? "booking-service selected"
                          : "booking-service"
                      }
                      aria-pressed={isSelected}
                      onClick={() => toggleService(service)}
                    >
                      <span className="service-select-mark">
                        {isSelected ? "✓" : "+"}
                      </span>

                      <span className="booking-service-info">
                        <strong>{service.name}</strong>
                        <small>
                          {service.duration} min · Sample price
                        </small>
                      </span>

                      <strong className="booking-service-price">
                        ₹{service.price}
                      </strong>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="booking-home-link"
                onClick={() => setSelectedServices([])}
              >
                I'll decide at the salon
              </button>

              <p className="booking-disclaimer">
                Indicative prices and sample services. Please confirm
                the final services and pricing with the salon.
              </p>
            </section>

            {/* 02 - DATE AND TIME */}
            <section className="booking-section">
              <div className="booking-section-title">
                <span>02</span>

                <div>
                  <h2>Date &amp; time</h2>
                  <p>Choose your preferred appointment slot.</p>
                </div>
              </div>

              <label
                className="booking-label"
                htmlFor="booking-date"
              >
                Appointment date
              </label>

              <input
                className="booking-date-input"
                id="booking-date"
                type="date"
                min={localToday}
                max={maxBookingDate}
                value={selectedDate}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setSelectedTime("");
                }}
                required
              />

              <label
                className="booking-label"
                htmlFor="booking-time"
              >
                Preferred time
              </label>

              <div className="booking-time-grid" id="booking-time">
                {timeSlots.map((time) => {
                  const unavailable = isTimeUnavailable(time);

                  return (
                    <button
                      type="button"
                      key={time}
                      className={
                        selectedTime === time
                          ? "booking-time selected"
                          : "booking-time"
                      }
                      aria-pressed={selectedTime === time}
                      disabled={unavailable}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              <p className="booking-disclaimer">
                Time options are sample slots, not live salon availability.
                Your appointment is not reserved until the salon confirms it.
              </p>
            </section>

            {/* 03 - PAYMENT */}
            <section className="booking-section">
              <div className="booking-section-title">
                <span>03</span>

                <div>
                  <h2>Payment method</h2>
                  <p>Choose how you would like to pay.</p>
                </div>
              </div>

              <div
                className="booking-service selected"
                aria-label="Pay at Salon selected"
              >
                <span className="service-select-mark">✓</span>

                <span className="booking-service-info">
                  <strong>Pay at Salon</strong>
                  <small>Pay by cash or UPI after your service.</small>
                </span>

                <strong className="booking-service-price">
                  {selectedServices.length > 0
                    ? `₹${totalPrice}`
                    : "To be confirmed"}
                </strong>
              </div>

              <p className="booking-disclaimer">
                No online payment is collected now. Your payment status
                will remain unpaid until the salon receives your payment.
              </p>
            </section>

            {/* 04 - CUSTOMER DETAILS */}
            <section className="booking-section">
              <div className="booking-section-title">
                <span>04</span>

                <div>
                  <h2>Your details</h2>
                  <p>Let the salon know who is visiting.</p>
                </div>
              </div>

              <label
                className="booking-label"
                htmlFor="customer-name"
              >
                Full name
              </label>

              <input
                className="booking-text-input"
                id="customer-name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
                minLength={2}
                maxLength={80}
                required
              />

              <label
                className="booking-label"
                htmlFor="customer-phone"
              >
                Mobile number
              </label>

              <input
                className="booking-text-input"
                id="customer-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={customerPhone}
                onChange={(event) =>
                  setCustomerPhone(
                    event.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                required
              />
            </section>

            <button
              className="booking-primary-button"
              type="submit"
            >
              Review appointment ↗
            </button>
          </form>

          {/* BOOKING SIDEBAR */}
          <aside className="booking-sidebar">
            <div className="booking-salon-card">
              <img
                className="booking-salon-image"
                src={salon.image}
                alt={salon.name}
              />

              <div className="booking-salon-details">
                <p className="booking-eyebrow">
                  YOUR SELECTED SALON
                </p>

                <h2>{salon.name}</h2>

                <p className="booking-salon-location">
                  {salon.location}
                </p>

                <p className="booking-salon-rating">
                  ★ {salon.rating}{" "}
                  <span>
                    ({salon.reviewCount} sample reviews)
                  </span>
                </p>

                <Link
                  to={`/salon/${salon.slug}`}
                  className="booking-view-salon"
                >
                  View salon details ↗
                </Link>
              </div>
            </div>

            {/* PRICE SUMMARY */}
            <div className="booking-summary">
              <p className="booking-eyebrow">
                PRICE TRANSPARENCY
              </p>

              <h2>Your bill summary</h2>

              {selectedServices.length === 0 ? (
                <p className="booking-summary-empty">
                  No services selected. You can decide at the salon.
                </p>
              ) : (
                selectedServices.map((service) => (
                  <div
                    className="booking-summary-row"
                    key={service.name}
                  >
                    <span>
                      {service.name}
                      <small>{service.duration} min</small>
                    </span>

                    <strong>₹{service.price}</strong>
                  </div>
                ))
              )}

              <div className="booking-summary-row">
                <span>Total duration</span>

                <strong>
                  {selectedServices.length > 0
                    ? `${totalDuration} min`
                    : "To be confirmed"}
                </strong>
              </div>

              <div className="booking-summary-row">
                <span>Extra charges</span>
                <strong>Not specified</strong>
              </div>

              <div className="booking-summary-total">
                <span>Estimated total</span>

                <strong>
                  {selectedServices.length > 0
                    ? `₹${totalPrice}`
                    : "To be confirmed"}
                </strong>
              </div>

              <p className="booking-summary-note">
                Any taxes or extra fees must be disclosed before payment.
                The final amount may change if the salon confirms different
                prices.
              </p>

              <div className="booking-summary-divider" />

              <p className="booking-summary-subtitle">
                APPOINTMENT
              </p>

              <p className="booking-summary-detail">
                <strong>Date:</strong>{" "}
                {selectedDate || "Not selected"}
              </p>

              <p className="booking-summary-detail">
                <strong>Time:</strong>{" "}
                {selectedTime || "Not selected"}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Booking;
