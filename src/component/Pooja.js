import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import LoginModal from "./Login";
import "./Pooja.css";

export default function Pooja() {

  const navigate = useNavigate();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("token"));

  /* 🔴 Auto hide toaster */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /* ============================= */
  /* Fetch Data */
  /* ============================= */

  useEffect(() => {

    if (!token) {
      setShowLogin(true);
      return;
    }

    fetchPoojas();

  }, [token]);

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    setToken(null);
    setShowLogin(true);
  };

  const fetchPoojas = async () => {

    setLoading(true);
    setError("");

    try {

      await sleep(600);

      const res = await fetch(
        "http://localhost:8080/astro/getpoojalist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            question: " ",
            category: "career"
          })
        }
      );

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error("API Failed");

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid API response");
      }

      setPoojas(data);

    } catch (err) {
      console.error(err);
      setError("❌ Failed to load pooja list");
    } finally {
      setLoading(false);
    }
  };

  /* ============================= */
  /* Handle Card Click */
  /* ============================= */

  const handleCardClick = (poojaId) => {

    if (!token) {
      setShowLogin(true);
      return;
    }

    navigate(`/address/${poojaId}`);
  };

  /* ============================= */
  /* UI */
  /* ============================= */

  return (
    <div className="pooja-page">

      <Header />

      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/">Home</Link>
          <Link to="/consult">Consult</Link>
          <Link to="/pooja">Pooja</Link>
          <Link to="/horoscope">Horoscope</Link>
          <Link to="/kundli">Kundli</Link>
          <Link to="/tarot">Tarot</Link>
          <Link to="/numerology">Numerology</Link>
          <Link to="/blog">Blog</Link>
        </div>
      </nav>

      {/* Loader */}
      {loading && (
        <div className="loader-overlay">
          <div className="divine-loader">
            <div className="ring"></div>
            <div className="ring glow"></div>
          </div>
          <p className="loader-text">
            Loading Divine Offerings<span className="dots">...</span>
          </p>
        </div>
      )}

      <h2>Divine Seva Offerings 🌸</h2>

      {/* Grid */}
      <div className="pooja-grid">

        {poojas.map((p) => (

          <div
            key={p.id}
            className="pooja-card clickable"
            onClick={() => handleCardClick(p.id)}
          >

            <h3>{p.name}</h3>
            <p>{p.description}</p>

            <ul>
              {p.items?.map((item, i) => (
                <li key={i}>{item.itemName}</li>
              ))}
            </ul>

            <div className="card-actions">

              <div className="price">
                ₹ {p.price}
              </div>

              <button
                className="book-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(p.id);
                }}
              >
                Book Now <span className="arrow">➜</span>
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* 🔴 Bottom Toaster */}
      {error && (
        <div className="bottom-toast">
          {error}
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => {
            setToken(localStorage.getItem("token"));
            setShowLogin(false);
          }}
        />
      )}

      <Footer />

    </div>
  );
}