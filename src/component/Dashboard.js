import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Footer from "./Footer";
import Header from "./Header";
import LoginModal from "./Login";
import Toast from "./Toast";

function Dashboard() {

  const [dob, setDob] = useState("");
  const [prediction, setPrediction] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
    setPrediction("");
    setHistory([]);
    setShowLogin(true);
    setToastMessage("Logged out successfully");
  };

  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const requireLogin = () => {
    if (!token) {
      setShowLogin(true);
      setToastMessage("Please login to continue");
      return true;
    }
    return false;
  };

  const handle401 = () => {
    localStorage.clear();
    setShowLogin(true);
    setToastMessage("Session expired. Please login again.");
  };

  const generate = async () => {
    if (requireLogin()) return;

    if (!dob) {
      setToastMessage("Please select your Date of Birth");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/astro/generate", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ dob }),
      });

      if (res.status === 401) {
        handle401();
        return;
      }

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to generate horoscope");
      }

      setPrediction(data.prediction || "");
      loadHistory();

    } catch (err) {
      console.error("Generate Error:", err);
      setToastMessage(err.message || "Something went wrong.");
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

      if (res.status === 401) {
        handle401();
        return;
      }

      const data = await res.json().catch(() => []);

      if (!res.ok) {
        throw new Error("Failed to load history");
      }

      setHistory(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("History Error:", err);
      setToastMessage("Failed to load history.");
      setHistory([]);
    }
  };

  return (
    <div className="dashboard-container">

      <Header />

      <nav className="nav-bar" style={{ marginTop: "70px" }}>
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

      <div className="dashboard-main">
        <div className="dashboard-content">

          <h1 className="welcome-text">
            Welcome {email || "Guest"}
          </h1>

          <div className="input-section">
            <label htmlFor="dob">Select Date of Birth:</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
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
              history.map((h) => (
                <p key={h.id}>✨ {h.prediction}</p>
              ))
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

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />

      <Footer />
    </div>
  );
}

export default Dashboard;