import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import "./Kundli.css";
import LoginModal from "./Login";

export default function Kundli() {

  const [form, setForm] = useState({
    name: "",
    dob: "",
    time: "",
    place: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Reset on mount
  useEffect(() => {
    setForm({ name: "", dob: "", time: "", place: "" });
    setResult(null);
    setError("");
  }, []);

  // Auto hide error toaster
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Show login if no token
  useEffect(() => {
    if (!token) setShowLogin(true);
  }, [token]);

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

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name.trim() || !form.dob || !form.time || !form.place.trim()) {
      setError("⚠ All birth details are required");
      return false;
    }
    return true;
  };

  // Generate Kundli
  const generateKundli = async () => {
    setError("");

    if (requireLogin()) return;
    if (!validate()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8080/astro/kundli", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(form)
      });

      if (res.status === 403) {
        setShowLogin(true);
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      setResult({
        zodiac: data.zodiac,
        nakshatra: data.nakshatra,
        planet: data.planet,
        prediction: data.prediction
      });

    } catch (err) {
      console.error(err);
      setError("❌ Authentication failed — please login again");
    } finally {
      setLoading(false);
    }
  };

  // Download PDF
  const downloadPdf = async () => {
    setError("");

    if (requireLogin()) return;
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:8080/astro/kundli/pdf", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(form)
      });

      if (res.status === 403) {
        setShowLogin(true);
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error("PDF failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.name || "kundli"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      setError("❌ PDF download failed");
    }
  };

  const reset = () => {
    setForm({ name: "", dob: "", time: "", place: "" });
    setResult(null);
    setError("");
  };

  return (
    <div className="kundli-page">
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

      <h2>Kundli Generator 🔮</h2>

      <div className="kundli-form">
        <input name="name" placeholder="Name" value={form.name} onChange={update} />
        <input type="date" name="dob" value={form.dob} onChange={update} />
        <input type="time" name="time" value={form.time} onChange={update} />
        <input name="place" placeholder="Birth Place" value={form.place} onChange={update} />

        <button onClick={generateKundli} disabled={loading}>
          {loading ? "Generating..." : "Generate Kundli"}
        </button>

        <button onClick={downloadPdf} disabled={loading}>
          Download PDF
        </button>

        <button className="reset-btn" onClick={reset}>
          Reset
        </button>
      </div>

      {/* Bottom Center Toaster */}
      {error && (
        <div className="bottom-toast">
          {error}
        </div>
      )}

      {result && (
        <div className="kundli-result">
          <h3>Your Birth Insight</h3>
          <p><b>Zodiac:</b> {result.zodiac}</p>
          <p><b>Nakshatra:</b> {result.nakshatra}</p>
          <p><b>Planet Influence:</b> {result.planet}</p>
          <p><b>Prediction:</b> {result.prediction}</p>
        </div>
      )}

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