import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../App.css";
import salons from "../data/salons";

function getSalonStatus(salon, currentTime) {
  const parseTime = (time) => {
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);

    if (!match) return null;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3].toUpperCase();

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const opening = parseTime(salon.openingTime);
  const closing = parseTime(salon.closingTime);

  if (opening === null || closing === null) return false;

  const now = new Date(currentTime);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return currentMinutes >= opening && currentMinutes < closing;
}

function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [currentTime, setCurrentTime] = useState(Date.now());

  const { user, authLoading } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  // Get unique salon areas
  const areas = [
    ...new Set(salons.map((salon) => salon.area)),
  ].sort((a, b) => a.localeCompare(b));

  // Search, filter and sort salons
  const filteredSalons = salons
    .filter((salon) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        salon.name.toLowerCase().includes(searchText) ||
        salon.location.toLowerCase().includes(searchText) ||
        salon.area.toLowerCase().includes(searchText);

      const matchesCategory =
        activeCategory === "All" ||
        salon.category === activeCategory;

      const matchesArea =
        selectedArea === "All" ||
        salon.area === selectedArea;

      return matchesSearch && matchesCategory && matchesArea;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-low") return a.startingPrice - b.startingPrice;
      if (sortBy === "price-high") return b.startingPrice - a.startingPrice;
      return a.id - b.id;
    });

  // Reset all filters
  function clearFilters() {
    setSearch("");
    setActiveCategory("All");
    setSelectedArea("All");
    setSortBy("recommended");
  }

  const hasActiveFilters =
    search !== "" ||
    activeCategory !== "All" ||
    selectedArea !== "All" ||
    sortBy !== "recommended";

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <Link className="brand" to="/">
          style<span>slot.</span>
        </Link>

        <nav className="nav-links">
          <a href="#explore">Explore</a>
          <a href="#services">Services</a>
          <a href="#about">About us</a>
        </nav>

        {authLoading ? (
          <span className="login-btn">Loading...</span>
        ) : user ? (
          <div className="nav-account">
            <span className="nav-welcome">
              Welcome back,{" "}
              {user.displayName?.trim().split(/\s+/)[0] || "there"}
            </span>

            <Link className="login-btn" to="/my-bookings">
              My appointments
            </Link>

            <button
              className="login-btn"
              type="button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        ) : (
          <Link className="login-btn" to="/login">
            Sign in ↗
          </Link>
        )}
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">YOUR STYLE, YOUR TIME</p>

            <h1>
              Good hair.
              <br />
              <span>Great plans.</span>
            </h1>

            <p className="hero-description">
              Discover great salons around you. Find your style,
              choose your service, and book your next great look.
            </p>

            <a className="primary-btn" href="#explore">
              Find your salon <span>↗</span>
            </a>

            <div className="hero-note">
              <span>✳</span> Good people. Great cuts. Zero waiting.
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=90"
              alt="Barber styling a client's hair"
            />

            <div className="image-caption">
              <span>THE ART OF GROOMING</span>
              <span>01 / 03</span>
            </div>
          </div>
        </section>

        {/* EXPLORE SECTION */}
        <section className="explore-section" id="explore">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE GOOD STUFF</p>
              <h2>Find your kind of place.</h2>
            </div>

            <p>Great places. Talented hands. Better hair days.</p>
          </div>

          {/* SEARCH BAR */}
          <div className="search-bar">
            <span>⌕</span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search salon or neighbourhood..."
              aria-label="Search salons"
            />

            <span className="search-location">Delhi NCR</span>
          </div>

          {/* CATEGORY + FILTER TOOLBAR */}
          <div className="explore-toolbar">
            <div className="category-list" id="services">
              {["All", "Barber", "Salon"].map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    activeCategory === category ? "category active" : "category"
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="salon-filters">
              <div className="filter-group">
                <label htmlFor="area-filter">Location</label>
                <select
                  id="area-filter"
                  value={selectedArea}
                  onChange={(event) => setSelectedArea(event.target.value)}
                >
                  <option value="All">All locations</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="sort-filter">Sort by</label>
                <select
                  id="sort-filter"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest rated</option>
                  <option value="price-low">Price: Low to high</option>
                  <option value="price-high">Price: High to low</option>
                </select>
              </div>

              <p className="results-count" aria-live="polite">
                {filteredSalons.length}{" "}
                {filteredSalons.length === 1 ? "salon" : "salons"} found
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="clear-filters"
                  onClick={clearFilters}
                >
                  Clear filters ↗
                </button>
              )}
            </div>
          </div>

          {/* SAMPLE DATA DISCLAIMER */}
          <p className="demo-data-note">
            Ratings, reviews, prices and opening hours shown are
            sample data for demonstration purposes.
          </p>

          {/* SALON CARDS */}
          <div className="salon-grid">
            {filteredSalons.map((salon) => {
              const isOpen = getSalonStatus(salon, currentTime);

              return (
                <article className="salon-card" key={salon.id}>
                  <div className="salon-image">
                    <img
                      src={salon.image}
                      alt={salon.name}
                    />

                    <span className="rating">
                      ★ {salon.rating}
                      <small>Sample rating</small>
                    </span>
                  </div>

                  <div className="salon-info">
                    <div>
                      <h3>{salon.name}</h3>
                      <p>{salon.location}</p>
                    </div>

                    <span className="salon-price">
                      <small>Starting from</small>
                      ₹{salon.startingPrice}+
                    </span>
                  </div>

                  {/* OPEN / CLOSED STATUS */}
                  <div className="salon-card-hours">
                    <span
                      className={`salon-card-status ${
                        isOpen ? "is-open" : "is-closed"
                      }`}
                    >
                      <span className="status-dot"></span>
                      {isOpen ? "Open now" : "Closed now"}
                    </span>

                    <span className="salon-card-timing">
                      {salon.openingTime} – {salon.closingTime}
                    </span>
                  </div>

                  <Link
                    className="book-btn"
                    to={`/salon/${salon.slug}`}
                  >
                    Explore salon <span>↗</span>
                  </Link>
                </article>
              );
            })}

            {/* EMPTY STATE */}
            {filteredSalons.length === 0 && (
              <div className="empty-message">
                <h3>No salons found</h3>

                <p>
                  Try another search or adjust your filters.
                </p>

                <button
                  type="button"
                  className="clear-filters"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM BANNER */}
        <section className="bottom-banner" id="about">
          <p className="eyebrow">
            YOUR NEXT LOOK STARTS HERE
          </p>

          <h2>Make time for yourself.</h2>

          <a href="#explore">Explore salons ↗</a>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <Link className="brand" to="/">
          style<span>slot.</span>
        </Link>

        <p>Good hair days start here.</p>

        <span>© 2026 StyleSlot</span>
      </footer>
    </div>
  );
}

export default Home;
