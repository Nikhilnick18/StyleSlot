
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import "./MyBookings.css";

function formatDate(dateString) {
  if (!dateString) return "Date not available";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function MyBookings() {
  const { user, authLoading } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedUserId, setLoadedUserId] = useState("");
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setBookings([]);
      setLoading(false);
      setLoadedUserId("");
      return;
    }

    setLoading(true);

    const bookingsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingData = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        bookingData.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;

          return bTime - aTime;
        });

        setBookings(bookingData);
        setLoadedUserId(user.uid);
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error("Bookings fetch error:", err);

        setError(
          "Unable to load your appointments. Please try again."
        );

        setLoadedUserId(user.uid);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  const isLoading =
    authLoading ||
    (Boolean(user) &&
      (loading || loadedUserId !== user.uid));

  async function handleCancelBooking(booking) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    setCancellingId(booking.id);
    setError("");

    try {
      await updateDoc(doc(db, "bookings", booking.id), {
        status: "cancelled",
        cancelledAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Booking cancellation failed:", err);

      setError(
        "We couldn't cancel this appointment. Please try again."
      );
    } finally {
      setCancellingId("");
    }
  }

  if (isLoading) {
    return (
      <main className="my-bookings-page">
        <div className="my-bookings-container">
          <p className="my-bookings-loading">
            Loading your appointments...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="my-bookings-page">
        <div className="my-bookings-empty">
          <span className="my-bookings-empty-icon">✦</span>

          <h1>Sign in to view your appointments.</h1>

          <p>
            Your salon visits will appear here after you book.
          </p>

          <Link to="/login" className="my-bookings-primary">
            Sign in ↗
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="my-bookings-page">
      <div className="my-bookings-container">

        <header className="my-bookings-heading">
          <p className="my-bookings-eyebrow">
            YOUR STYLE, YOUR SCHEDULE
          </p>

          <h1>My appointments.</h1>

          <p>
            Your salon visits, all in one place.
          </p>
        </header>

        {error && (
          <p className="my-bookings-error" role="alert">
            {error}
          </p>
        )}

        {!loading && bookings.length === 0 ? (
          <div className="my-bookings-empty">
            <span className="my-bookings-empty-icon">✦</span>

            <h2>No appointments yet.</h2>

            <p>
              Your next salon visit is just a few clicks away.
            </p>

            <Link to="/" className="my-bookings-primary">
              Explore salons ↗
            </Link>
          </div>
        ) : (
          <div className="appointments-list">
            {bookings.map((booking) => {
              const status = (
                booking.status || "pending"
              ).toLowerCase();

              return (
                <article
                  className="appointment-card"
                  key={booking.id}
                >
                  <div className="appointment-top">
                    <div className="appointment-salon">
                      <p className="appointment-eyebrow">
                        YOUR APPOINTMENT
                      </p>

                      <h2>
                        {booking.salonName || "Salon"}
                      </h2>

                      <p className="appointment-location">
                        {booking.salonLocation ||
                          "Location not available"}
                      </p>
                    </div>

                    <span
                      className={`appointment-status status-${status}`}
                    >
                      {status.charAt(0).toUpperCase() +
                        status.slice(1)}
                    </span>
                  </div>

                  <div className="appointment-divider" />

                  <div className="appointment-details-grid">
                    <div className="appointment-detail">
                      <span className="detail-label">DATE</span>
                      <strong>
                        {formatDate(booking.date)}
                      </strong>
                    </div>

                    <div className="appointment-detail">
                      <span className="detail-label">TIME</span>
                      <strong>
                        {booking.time || "Not available"}
                      </strong>
                    </div>

                    <div className="appointment-detail">
                      <span className="detail-label">CUSTOMER</span>
                      <strong>
                        {booking.customerName || "—"}
                      </strong>
                    </div>

                    <div className="appointment-detail">
                      <span className="detail-label">MOBILE</span>
                      <strong>
                        {booking.customerPhone || "—"}
                      </strong>
                    </div>
                  </div>

                  <div className="appointment-services">
                    <h3>Selected services</h3>

                    {booking.services?.length > 0 ? (
                      <div className="appointment-service-list">
                        {booking.services.map(
                          (service, index) => (
                            <div
                              className="appointment-service-row"
                              key={`${service.name}-${index}`}
                            >
                              <span>
                                {service.name}

                                <small>
                                  {service.duration} min
                                </small>
                              </span>

                              <strong>
                                ₹{service.price}
                              </strong>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="appointment-muted">
                        Service selection to be decided at the salon.
                      </p>
                    )}
                  </div>

                  <div className="appointment-payment">
                    <div>
                      <span className="detail-label">
                        PAYMENT METHOD
                      </span>
                      <strong>Pay at Salon</strong>
                    </div>

                    <div>
                      <span className="detail-label">
                        PAYMENT STATUS
                      </span>
                      <strong className="payment-unpaid">
                        {booking.paymentStatus || "Unpaid"}
                      </strong>
                    </div>
                  </div>

                  <div className="appointment-total">
                    <div>
                      <span>Estimated total</span>

                      <small>
                        Total duration:{" "}
                        {booking.totalDuration || 0} min
                      </small>
                    </div>

                    <strong>
                      {booking.services?.length > 0
                        ? `₹${booking.totalPrice || 0}`
                        : "To be confirmed"}
                    </strong>
                  </div>

                  <div className="appointment-actions">
                    {booking.salonSlug && (
                      <Link
                        to={`/salon/${booking.salonSlug}`}
                        className="appointment-view-link"
                      >
                        View salon ↗
                      </Link>
                    )}

                    {status === "pending" && (
                      <button
                        type="button"
                        className="appointment-cancel-button"
                        onClick={() =>
                          handleCancelBooking(booking)
                        }
                        disabled={cancellingId === booking.id}
                      >
                        {cancellingId === booking.id
                          ? "Cancelling..."
                          : "Cancel appointment"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyBookings;
