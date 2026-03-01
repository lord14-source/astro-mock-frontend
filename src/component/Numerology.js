import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./Home.css";
import LoginModal from "./Login";

const API_URL = "http://localhost:8080/astro/numerology";

export default function Numerology() {

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  /* 🔐 Auto logout handler */
  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    setToken(null);
    setShowLogin(true);
  };

  useEffect(() => {
    if (!token) {
      setShowLogin(true);
    }
  }, [token]);

  /* 📡 API CALL */
  const fetchNumerology = async () => {

    if (!name.trim() || !dob) {
      setError("Please enter valid Name and Date of Birth");
      return;
    }

    if (!token) {
      setShowLogin(true);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {

      await sleep(500);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ name, dob })
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error("API Failed");

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.error(err);
      setError("Unable to calculate numerology. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <Header />

      {/* 🔥 Full Screen Loader */}
      {loading && (
        <div className="loader-overlay">
          <div className="divine-loader">
            <div className="ring"></div>
            <div className="ring glow"></div>
          </div>
          <p className="loader-text">
            Aligning Your Cosmic Energy<span className="dots">...</span>
          </p>
        </div>
      )}

      <section className="container hero">
        <div className="hero-box">

          <h2>🔢  Numerology Calculator</h2>
          <p>AI-powered Vedic numerology from backend engine</p>

          <div style={{ marginTop: "25px" }}>

            <input
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              disabled={loading}
            />

            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={inputStyle}
              disabled={loading}
            />

            <button
              onClick={fetchNumerology}
              style={{
                ...buttonStyle,
                opacity: loading ? 0.6 : 1
              }}
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate Now"}
            </button>

          </div>

          {error && (
            <p style={{ color: "#ff4d4f", marginTop: "15px" }}>
              {error}
            </p>
          )}

          {result && (
            <div style={resultBox} className="fade-in">

              <h3>✨ Your Divine Numbers</h3>

              <div className="result-row">
                <div>
                  <strong>Life Path</strong>
                  <h2>{result.lifePath}</h2>
                  <p>{result.lifePathMeaning}</p>
                </div>

                <div>
                  <strong>Destiny</strong>
                  <h2>{result.destiny}</h2>
                  <p>{result.destinyMeaning}</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

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

/* ---------- STYLES ---------- */

const inputStyle = {
  padding: "12px",
  margin: "10px",
  borderRadius: "10px",
  border: "1px solid #e72d2d",
  width: "260px",
  fontSize: "14px"
};

const buttonStyle = {
  padding: "12px 25px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#6c5ce7",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
  transition: "0.3s"
};

const resultBox = {
  marginTop: "30px",
  padding: "25px",
  background: "linear-gradient(135deg, #de7534, #6c5ce7)",
  borderRadius: "15px",
  color: "white",
  animation: "fadeIn 0.5s ease-in-out"
};