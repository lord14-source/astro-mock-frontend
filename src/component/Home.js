import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import "./Home.css";

/* ---------- Compact Card ---------- */
const Card = ({ icon, title, to }) => (
  <Link to={to} className="card-link">
    <div className="card">
      <div className="card-left">
        <span className="card-icon">{icon}</span>
        <span className="card-title">{title}</span>
      </div>
      <span className="card-arrow">→</span>
    </div>
  </Link>
);

/* ---------- Astrologer Card ---------- */
const AstrologerCard = ({ astro }) => (
  <div className="astro-card">
    <img
      src={
        astro.photo
          ? `data:image/jpeg;base64,${astro.photo}`
          : "https://i.pravatar.cc/150?img=3"
      }
      alt={astro.name}
      onError={(e) =>
        (e.target.src = "https://i.pravatar.cc/150?img=3")
      }
    />
    <h3>{astro.name}</h3>
    <p className="astro-exp">{astro.experience}</p>
    <p className="astro-desc">{astro.description}</p>
    <p className="astro-phone">📞 {astro.phone}</p>
    <button className="astro-btn">Consult</button>
  </div>
);

/* ---------- Home ---------- */
export default function Home() {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔐 Redirect if not logged in
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8080/astro/astrologerlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAstrologers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching astrologers:", error);

        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }

        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="page">
      <Header />

      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="container hero">
        <div className="hero-box">
          <div className="planet-bg">
            <span className="planet planet1"></span>
            <span className="planet planet2"></span>
            <span className="planet planet3"></span>
            <span className="star star1"></span>
            <span className="star star2"></span>
            <span className="star star3"></span>
          </div>

          <h2>Ancient Vedic Guidance</h2>
          <p>Horoscope insights & kundli wisdom for modern life.</p>

          <Link to="/login" className="hero-btn">
            Start Free Chat
          </Link>
        </div>
      </section>

      {/* Quick Cards */}
      <section className="container cards">
        <Card icon="📞" title="Talk" to="/talk" />
        <Card icon="💬" title="Chat" to="/chat" />
        <Card icon="☀" title="Horoscope" to="/horoscope" />
        <Card icon="☸" title="Kundli" to="/kundli" />
      </section>

      {/* Astrologer Section */}
      <section className="container astro-section">
        <h2 className="section-title">Top Astrologers</h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading astrologers...</p>
        ) : (
          <div className="astro-grid">
            {astrologers.length > 0 ? (
              astrologers.map((astro) => (
                <AstrologerCard key={astro.id} astro={astro} />
              ))
            ) : (
              <p style={{ textAlign: "center" }}>
                No astrologers available.
              </p>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}