import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./Login";
import "./Pooja.css";

export default function Pooja() {

  const navigate = useNavigate();
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  useEffect(() => {

    if (!token) {
      setShowLogin(true);
      return;
    }

    fetchPoojas();

  }, [token]);

  const fetchPoojas = async () => {

    setLoading(true);
    setError("");

    try {

      await sleep(500);

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

      if (res.status === 403) {
        setShowLogin(true);
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error();

      const data = await res.json();
      setPoojas(data);

    } catch (err) {

      console.error(err);
      setError("Failed to load pooja list");

    } finally {

      setLoading(false);
    }
  };

  const handleCardClick = (poojaId) => {

    if (!token) {
      setShowLogin(true);
      return;
    }

    navigate(`/address/${poojaId}`);
  };

  return (

    <div className="pooja-page">

      {/* 🔥 ADVANCED LOADER */}
      {loading && (
        <div className="loader-overlay">

          <div className="divine-loader">
            <div className="ring"></div>
            <div className="ring glow"></div>
          </div>

          <p className="loader-text">
            Loading Poojas<span className="dots">...</span>
          </p>

        </div>
      )}

      <h2>Divine Seva Offerings 🌸</h2>

      {error && <p className="error">{error}</p>}

      <div className="pooja-grid">

        {poojas.map(p => (

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
                style={{marginTop:"0px"}}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(p.id);
                }}
              >
                Book Now ➡
              </button>

            </div>

          </div>

        ))}

      </div>

      {showLogin && (
        <LoginModal
          onClose={() => {
            setToken(localStorage.getItem("token"));
            setShowLogin(false);
          }}
        />
      )}

    </div>
  );
}