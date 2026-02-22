import { useEffect, useState } from "react";
import LoginModal from "./Login";
import Sidebar from "./Sidebar";

function Dashboard() {

  const [dob, setDob] = useState("");
  const [prediction, setPrediction] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  // ⭐ Load dashboard preview
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
    Authorization: "Bearer " + token
  });

  const requireLogin = () => {

    if (!token) {

      setShowLogin(true);
      return true;
    }

    return false;
  };

  // 🔮 Generate horoscope
  const generate = async () => {

    if (requireLogin()) return;

    if (!dob) {

      setError("Please select DOB");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const res = await fetch(
        "http://localhost:8080/astro/generate",
        {
          method: "POST",
          headers: authHeader(),
          body: JSON.stringify({ dob })
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setPrediction(data.prediction || "");

      loadHistory();

    } catch (err) {

      console.error(err);
      setError("Generate failed");

    } finally {

      setLoading(false);
    }
  };

  // 📜 History
  const loadHistory = async () => {

    if (requireLogin()) return;

    try {

      const res = await fetch(
        "http://localhost:8080/astro/history",
        { headers: authHeader() }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setHistory(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error(err);
      setHistory([]);
    }
  };

  return (

    <div className="dashboard">

      <Sidebar logout={logout} />

      <div className="content">

        <h1>
          Welcome {email || "Guest"}
        </h1>

        <input
          type="date"
          value={dob}
          onChange={e => setDob(e.target.value)}
        />

        <br /><br />

        <button
          onClick={generate}
          disabled={loading}
        >
          {loading
            ? "Generating..."
            : "Generate Horoscope"}
        </button>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {prediction && (
          <div className="card">
            ✨ {prediction}
          </div>
        )}

        <h2>History</h2>

        <div className="card">

          {history.length === 0 &&
            <p>No history yet</p>}

          {history.map(h => (
            <p key={h.id}>
              {h.prediction}
            </p>
          ))}

        </div>

      </div>

      {/* ⭐ Login popup */}
      {showLogin && (
        <LoginModal
          onClose={() => {

            setShowLogin(false);
            loadHistory();
          }}
        />
      )}

    </div>
  );
}

export default Dashboard;
