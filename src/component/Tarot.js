import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import "./Tarot.css";

/* Tarot deck with built-in SVG art */
const tarotDeck = [
  {
    name: "The Fool",
    meaning: "New beginnings, leap of faith, adventure.",
    icon: "🌄"
  },
  {
    name: "The Magician",
    meaning: "Manifestation, power, inspired action.",
    icon: "✨"
  },
  {
    name: "The High Priestess",
    meaning: "Intuition, inner wisdom, mystery.",
    icon: "🌙"
  },
  {
    name: "The Empress",
    meaning: "Abundance, nurturing, creativity.",
    icon: "🌸"
  },
  {
    name: "The Emperor",
    meaning: "Authority, structure, leadership.",
    icon: "👑"
  },
  {
    name: "The Lovers",
    meaning: "Union, harmony, important choices.",
    icon: "❤️"
  }
];

export default function Tarot() {

  const [card, setCard] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const drawCard = () => {
    if (card) return;

    const randomCard =
      tarotDeck[Math.floor(Math.random() * tarotDeck.length)];

    setCard(randomCard);

    setTimeout(() => {
      setFlipped(true);
    }, 300);
  };

  const reset = () => {
    setFlipped(false);
    setTimeout(() => {
      setCard(null);
    }, 500);
  };

  return (
    <div className="page tarot-page">

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

      <h2>Tarot Reading 🔮</h2>

      {!card && (
        <button className="draw-btn" onClick={drawCard}>
          Draw a Card
        </button>
      )}

      {card && (
        <div className={`card-container ${flipped ? "flip" : ""}`}>
          <div className="tarot-card">

            {/* Front */}
            <div className="card-front">
              ✦ TAROT ✦
            </div>

            {/* Back */}
            <div className="card-back">
              <div className="tarot-icon">
                {card.icon}
              </div>
              <h3>{card.name}</h3>
              <p>{card.meaning}</p>
            </div>

          </div>
        </div>
      )}

      {card && (
        <button className="reset-btn" onClick={reset}>
          Draw Again
        </button>
      )}

      <Footer />
    </div>
  );
}