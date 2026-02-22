import { Link } from "react-router-dom";
import Sashi from "../image/data_shivam.jpeg";
import Pic from "../image/jaigurudev.png";
import Shivam from "../image/sashi_data.jpeg";
import Footer from "./Footer"; // ✅ ADD THIS
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
    <img src={astro.photo} alt={astro.name} />
    <h3>{astro.name}</h3>
    <p className="astro-exp">{astro.experience}</p>
    <p className="astro-desc">{astro.desc}</p>
    <p className="astro-phone">📞 {astro.phone}</p>
    <button className="astro-btn">Consult</button>
  </div>
);

/* ---------- Dummy Astrologers ---------- */
const astrologers = [
  {
    name: "Astro Gaurav Acharya",
    photo: Pic,
    phone: "9876543210",
    experience: "12 years experience",
    desc: "Expert in Vedic astrology and kundli analysis."
  },
  {
    name: "Shivam Dubey",
    photo: Sashi,
    phone: "9140187806",
    experience: "8 years experience",
    desc: "Jyotish Karmkand, Specialist in love & relationship guidance."
  },
  {
    name: "Shashi Kumar Tiwari",
    photo: Shivam,
    phone: "9999876401",
    experience: "15 years experience",
    desc: "Career and finance astrology expert."
  },
  {
    name: "Astro Kavya",
    photo: "https://i.pravatar.cc/150?img=9",
    phone: "9012345678",
    experience: "6 years experience",
    desc: "Tarot and intuitive reading specialist."
  },
  {
    name: "Astro Arjun",
    photo: "https://i.pravatar.cc/150?img=7",
    phone: "9090909090",
    experience: "10 years experience",
    desc: "Marriage and compatibility consultant."
  },
  {
    name: "Astro Neha",
    photo: Pic,
    phone: "9765432100",
    experience: "9 years experience",
    desc: "Numerology and life path guidance."
  }
];

/* ---------- Home ---------- */
export default function Home() {
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

      {/* Hero */}
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

      {/* Quick cards */}
      <section className="container cards">
        <Card icon="📞" title="Talk" to="/talk" />
        <Card icon="💬" title="Chat" to="/chat" />
        <Card icon="☀" title="Horoscope" to="/horoscope" />
        <Card icon="☸" title="Kundli" to="/kundli" />
      </section>

      {/* Astrologers */}
      <section className="container astro-section">
        <h2 className="section-title">Top Astrologers</h2>
        <div className="astro-grid">
          {astrologers.map((astro, i) => (
            <AstrologerCard key={i} astro={astro} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}