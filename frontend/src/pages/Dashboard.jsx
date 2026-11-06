
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import "./Dashboard.css";

const ADMIN_UID = "bWaiHqbZ1sRWvYYbfL9u0JavV493";

function formatDate(dateString) {
  if (!dateString) return "Date unavailable";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const { user, authLoading } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [filter, setFilter] = useState("all");

  // FETCH ALL BOOKINGS FOR ADMIN
  useEffect(() => {
    if (authLoading) return;

    if (!user || user.uid !== ADMIN_UID) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const unsubscribe = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const bookingList = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        bookingList.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });

        setBookings(bookingList);
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error("Dashboard Firestore error:", err);

        setError(
          err.code === "permission-denied"
            ? "Access denied. Please check your admin UID and Firestore Rules."
            : err.message || "Unable to load bookings."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  // BOOKING STATISTICS
  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const confirmedValue = bookings
    .filter((booking) =>
      ["confirmed", "completed"].includes(booking.status)
    )
    .reduce(
      (total, booking) =>
        total + (Number(booking.totalPrice) || 0),
      0
    );

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      note: "All salon appointments",
    },
    {
      label: "Pending",
      value: pendingCount,
      note: "Awaiting confirmation",
    },
    {
      label: "Confirmed",
      value: confirmedCount,
      note: "Approved appointments",
    },
    {
      label: "Completed",
      value: completedCount,
      note: "Finished appointments",
    },
    {
      label: "Cancelled",
      value: cancelledCount,
      note: "Cancelled appointments",
    },
  ];

  // UPDATE BOOKING STATUS
  async function updateBookingStatus(bookingId, newStatus) {
    const allowedStatuses = [
      "confirmed",
      "cancelled",
      "completed",
    ];

    if (!allowedStatuses.includes(newStatus)) return;

    const booking = bookings.find(
      (item) => item.id === bookingId
    );

    if (!booking) return;

    if (newStatus === "completed" && booking.status !== "confirmed") {
      return;
    }

    if (
      newStatus === "confirmed" &&
      booking.status !== "pending"
    ) {
      return;
    }

    if (
      newStatus === "cancelled" &&
      !["pending", "confirmed"].includes(booking.status)
    ) {
      return;
    }

    const action = newStatus.charAt(0).toUpperCase() +
      newStatus.slice(1);

    const accepted = window.confirm(
      `Are you sure you want to ${action.toLowerCase()} this booking?`
    );

    if (!accepted) return;

    setUpdatingId(bookingId);
    setError("");

    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: newStatus,
        statusUpdatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Booking status update failed:", err);

      setError(
        err.code === "permission-denied"
          ? "Permission denied. Check Firestore admin update rules."
          : "Unable to update booking status. Please try again."
      );
    } finally {
      setUpdatingId("");
    }
  }

  // ACCESS CHECK
  if (authLoading) {
    return (
      <main className="owner-dashboard">
        <div className="dashboard-loading">
          Checking your account...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="owner-dashboard">
        <div className="dashboard-access-message">
          <h1>Admin sign in required</h1>
          <p>Please sign in with your admin account.</p>
          <Link to="/login">Sign in ↗</Link>
        </div>
      </main>
    );
  }

  if (user.uid !== ADMIN_UID) {
    return (
      <main className="owner-dashboard">
        <div className="dashboard-access-message">
          <h1>Access restricted</h1>
          <p>This dashboard is only available to the StyleSlot administrator.</p>
          <Link to="/">Back to website ↗</Link>
        </div>
      </main>
    );
  }

  const visibleBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  return (
    <main className="owner-dashboard">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-logo">
          style<span>slot.</span>
        </Link>

        <div className="dashboard-header-actions">
          <span className="dashboard-admin-label">
            Administrator
          </span>

          <Link to="/" className="dashboard-home-link">
            View website ↗
          </Link>
        </div>
      </header>

      <div className="dashboard-container">
        {/* WELCOME */}
        <div className="dashboard-welcome">
          <div>
            <p className="dashboard-eyebrow">
              PLATFORM MANAGEMENT
            </p>

            <h1>Admin Dashboard</h1>

            <p>
              Manage appointments and monitor StyleSlot activity.
            </p>

            <span className="dashboard-salon-name">
              All salons · Central management
            </span>
          </div>

          <span className="dashboard-date">
            Live dashboard
          </span>
        </div>

        {/* CONNECTION STATUS */}
        <div className="dashboard-connection-status">
          {error ? (
            <p className="dashboard-error">{error}</p>
          ) : (
            <p className="dashboard-owner-verified">
              ✓ Connected to Firestore
            </p>
          )}
        </div>

        {/* STATISTICS */}
        <section className="dashboard-stats">
          {stats.map((stat) => (
            <article
              className="dashboard-stat-card"
              key={stat.label}
            >
              <p>{stat.label}</p>
              <h2>{stat.value}</h2>
              <span>{stat.note}</span>
            </article>
          ))}
        </section>

        {/* BOOKINGS */}
        <section className="dashboard-bookings">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-eyebrow">
                PLATFORM ACTIVITY
              </p>

              <h2>All appointments</h2>
            </div>

            <span className="dashboard-count">
              {visibleBookings.length} appointments
            </span>
          </div>

          {/* FILTERS */}
          <div className="dashboard-filters">
            {[
              "all",
              "pending",
              "confirmed",
              "completed",
              "cancelled",
            ].map((status) => (
              <button
                type="button"
                key={status}
                className={
                  filter === status
                    ? "dashboard-filter active"
                    : "dashboard-filter"
                }
                onClick={() => setFilter(status)}
              >
                {status === "all"
                  ? "All"
                  : status.charAt(0).toUpperCase() +
                    status.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="dashboard-empty">
              <h3>Loading appointments...</h3>
              <p>Fetching bookings from all salons.</p>
            </div>
          ) : error ? (
            <div className="dashboard-empty">
              <h3>Unable to load appointments</h3>
              <p>{error}</p>
            </div>
          ) : visibleBookings.length === 0 ? (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">✦</div>
              <h3>No appointments found</h3>
              <p>
                Bookings matching this filter will appear here.
              </p>
            </div>
          ) : (
            <div className="dashboard-booking-list">
              {visibleBookings.map((booking) => (
                <article
                  className="dashboard-booking-card"
                  key={booking.id}
                >
                  <div className="dashboard-booking-top">
                    <div>
                      <h3>
                        {booking.customerName || "Customer"}
                      </h3>

                      <p>
                        {booking.customerPhone || "No phone provided"}
                      </p>
                    </div>

                    <span
                      className={`dashboard-status ${
                        booking.status || "pending"
                      }`}
                    >
                      {booking.status || "pending"}
                    </span>
                  </div>

                  <div className="dashboard-booking-details">
                    <p>
                      <strong>Salon:</strong>{" "}
                      {booking.salonName || "Unknown salon"}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {booking.salonLocation || "—"}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(booking.date)}
                    </p>

                    <p>
                      <strong>Time:</strong>{" "}
                      {booking.time || "—"}
                    </p>

                    <p>
                      <strong>Customer email:</strong>{" "}
                      {booking.userEmail || "—"}
                    </p>

                    <p>
                      <strong>Payment:</strong>{" "}
                      {booking.paymentStatus || "Unpaid"}
                    </p>

                    <p className="dashboard-service-detail">
                      <strong>Services:</strong>{" "}
                      {booking.services
                        ?.map((service) => service.name)
                        .join(", ") || "To be decided at salon"}
                    </p>
                  </div>

                  <div className="dashboard-booking-bottom">
                    <span>
                      ₹{Number(booking.totalPrice) || 0}
                    </span>

                    <small>
                      {booking.totalDuration || 0} minutes
                    </small>
                  </div>

                  {/* ADMIN ACTIONS */}
                  <div className="dashboard-booking-actions">
                    {booking.status === "pending" && (
                      <>
                        <button
                          type="button"
                          className="dashboard-action-button confirm"
                          disabled={updatingId === booking.id}
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "confirmed"
                            )
                          }
                        >
                          {updatingId === booking.id
                            ? "Updating..."
                            : "Confirm booking"}
                        </button>

                        <button
                          type="button"
                          className="dashboard-action-button cancel"
                          disabled={updatingId === booking.id}
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "cancelled"
                            )
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {booking.status === "confirmed" && (
                      <>
                        <button
                          type="button"
                          className="dashboard-action-button complete"
                          disabled={updatingId === booking.id}
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "completed"
                            )
                          }
                        >
                          {updatingId === booking.id
                            ? "Updating..."
                            : "Mark completed"}
                        </button>

                        <button
                          type="button"
                          className="dashboard-action-button cancel"
                          disabled={updatingId === booking.id}
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "cancelled"
                            )
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {booking.status === "completed" && (
                      <span className="dashboard-action-note">
                        Appointment completed
                      </span>
                    )}

                    {booking.status === "cancelled" && (
                      <span className="dashboard-action-note">
                        Booking cancelled
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* OVERVIEW */}
        <section className="dashboard-quick-actions">
          <h2>Platform overview</h2>

          <div className="dashboard-action-grid">
            <article>
              <span>01</span>
              <h3>Pending requests</h3>
              <p>
                {pendingCount} appointments awaiting admin review.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Completed appointments</h3>
              <p>
                {completedCount} appointments successfully completed.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Confirmed booking value</h3>
              <p>
                ₹{confirmedValue.toLocaleString("en-IN")}
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
