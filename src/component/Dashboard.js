import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Footer from "./Footer";
import Header from "./Header";
import LoginModal from "./Login";

function Dashboard() {
  const [dob, setDob] = useState("");
  const [prediction, setPrediction] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setShowLogin(true);
    } else {
      loadHistory();
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setShowLogin(true);
    setPrediction("");
    setHistory([]);
  };

  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const requireLogin = () => {
    if (!token) {
      setShowLogin(true);
      return true;
    }
    return false;
  };

  const generate = async () => {
    if (requireLogin()) return;
    if (!dob) {
      setError("Please select your Date of Birth");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/astro/generate", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ dob }),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Server Error");
      }

      const data = await res.json();
      setPrediction(data.prediction || "");
      loadHistory();
    } catch (err) {
      console.error("Generate Error:", err);
      setError("Failed to generate horoscope. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (requireLogin()) return;

    try {
      const res = await fetch("http://localhost:8080/astro/history", {
        headers: authHeader(),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Server Error");
      }

      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("History Error:", err);
      setError("Failed to load history.");
      setHistory([]);
    }
  };

  return (
    <div className="dashboard-container">

      {/* Header */}
     <Header/>      

      {/* Navbar */}
      <nav className="nav-bar" style={{marginTop:"70px"}}>
        <div className="nav-inner">
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

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-content">
          <h1 className="welcome-text">Welcome {email || "Guest"}</h1>

          <div className="input-section">
            <label htmlFor="dob">Select Date of Birth:</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="dob-input"
            />
          </div>

          <button
            className="generate-btn"
            onClick={generate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Horoscope"}
          </button>

          {error && <p className="error-text">{error}</p>}

          {prediction && (
            <div className="card prediction-card">
              ✨ {prediction}
            </div>
          )}

          <h2 className="history-title">History</h2>
          <div className="card history-card">
            {history.length === 0 ? (
              <p>No history yet</p>
            ) : (
              history.map(h => <p key={h.id}>✨ {h.prediction}</p>)
            )}
          </div>
        </div>
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => {
            setShowLogin(false);
            loadHistory();
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default Dashboard;