import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import Footer from "./Footer";
import Header from "./Header";
import LoginModal from "./Login";
import "./Tarot.css";
import Toast from "./Toast";

export default function Tarot() {

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [showLogin, setShowLogin] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  /* -------------------- Effects -------------------- */

  useEffect(() => {
    if (!token) setShowLogin(true);
  }, [token]);

  useEffect(() => {
    if (flipped) {
      const audio = new Audio(process.env.PUBLIC_URL + "/flip.wav");
      audio.play().catch(() => {});
    }
  }, [flipped]);

  /* -------------------- Helpers -------------------- */

  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  });

  const requireLogin = () => {
    if (!token) {
      setShowLogin(true);
      return true;
    }
    return false;
  };

  /* -------------------- Draw Cards -------------------- */

  const drawCards = async () => {

    if (requireLogin()) return;
    if (cards.length > 0) return;

    setLoading(true);
    setAiMessage("");

    try {

      const data = await apiRequest(
        "http://localhost:8080/astro/tarot",
        {
          method: "POST",
          headers: authHeader()
        }
      );

      setTimeout(() => {
        setCards(data.cards);
        setFlipped(true);
        setLoading(false);
      }, 1200);

      setAiMessage(data.interpretation);

    } catch (err) {

      console.error("Tarot API Error:", err);

      if (err.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setShowLogin(true);
        setToastMessage(err.message || "Login required");
      }
      else if (err.status === 402) {
        setToastMessage(err.message || "Premium subscription required 💎");
      }
      else if (err.status === 403) {
        setToastMessage(err.message || "Access denied 🚫");
      }
      else {
        setToastMessage(err.message || "Server error. Try again.");
      }

      setLoading(false);
    }
  };

  /* -------------------- Reset -------------------- */

  const reset = () => {
    setFlipped(false);
    setTimeout(() => {
      setCards([]);
      setAiMessage("");
    }, 500);
  };

  /* -------------------- UI -------------------- */

  return (

    <div className="tarot-page cosmic-bg">

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

      <h2 className="title-glow">🔮 Divine Tarot Reading</h2>

      {cards.length === 0 && (
        <button
          className="draw-btn"
          onClick={drawCards}
          disabled={loading}
        >
          {loading ? "Summoning Cosmic Energies..." : "Reveal My Destiny"}
        </button>
      )}

      <div className="spread">

        {cards.map((card, index) => (
          <div key={index} className={`card-container ${flipped ? "flip" : ""}`}>
            <div className="tarot-card">

              <div className="card-front">✦ TAROT ✦</div>

              <div className={`card-back ${card.reversed ? "reversed" : ""}`}>

                <div className="tarot-icon">🔮</div>

                <h3>{card.name}</h3>

                <p>{card.meaning}</p>

                <small>
                  {index === 0 && "Past"}
                  {index === 1 && "Present"}
                  {index === 2 && "Future"}
                  {card.reversed && " • Reversed"}
                </small>

              </div>

            </div>
          </div>
        ))}

      </div>

      {aiMessage && (
        <div className="ai-interpretation glass">
          ✨ {aiMessage}
        </div>
      )}

      {cards.length > 0 && (
        <button className="reset-btn" onClick={reset}>
          Draw Again
        </button>
      )}

      {showLogin && (
        <LoginModal
          onClose={() => {
            const savedToken = localStorage.getItem("token");
            setToken(savedToken);
            setShowLogin(false);
          }}
        />
      )}

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />

      <Footer />

    </div>
  );
}