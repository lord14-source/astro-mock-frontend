import { useState } from "react";
import "./Tarot.css";

/* sample tarot deck */
const tarotDeck = [
  {
    name: "The Fool",
    meaning: "New beginnings, leap of faith, adventure."
  },
  {
    name: "The Magician",
    meaning: "Manifestation, power, inspired action."
  },
  {
    name: "The High Priestess",
    meaning: "Intuition, inner wisdom, mystery."
  },
  {
    name: "The Empress",
    meaning: "Abundance, nurturing, creativity."
  },
  {
    name: "The Emperor",
    meaning: "Authority, structure, leadership."
  },
  {
    name: "The Lovers",
    meaning: "Union, harmony, important choices."
  }
];

export default function Tarot() {

  const [card, setCard] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const drawCard = () => {

    if (card) return;

    const random =
      tarotDeck[Math.floor(Math.random() * tarotDeck.length)];

    setCard(random);

    setTimeout(() => setFlipped(true), 200);
  };

  const reset = () => {
    setFlipped(false);
    setTimeout(() => setCard(null), 300);
  };

  return (

    <div className="tarot-page">

      <h2>Tarot Reading 🔮</h2>

      {!card && (
        <button className="draw-btn"  style={{ color: "brown",backgroundColor:"orange" ,marginTop:"50px",maxWidth:"40%"}} onClick={drawCard}>
          Draw a Card
        </button>
      )}

      {card && (

        <div className={`card-container ${flipped ? "flip" : ""}`}>

          <div className="tarot-card">

            <div className="card-front">
              ✦ Tarot ✦
            </div>

            <div className="card-back">
              <h3>{card.name}</h3>
              <p>{card.meaning}</p>
            </div>

          </div>

        </div>
      )}

      {card && (
        <button className="reset-btn"  style={{ color: "brown",backgroundColor:"orange" ,marginTop:"50px",maxWidth:"40%"}} onClick={reset}>
          Draw Again
        </button>
      )}

    </div>
  );
}