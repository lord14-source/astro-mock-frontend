import { useEffect, useState } from "react";
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

  // ---------- AUTH ----------

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

  // ---------- FORM ----------

  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    if (!form.name || !form.dob || !form.time || !form.place) {
      setError("All birth details are required");
      return false;
    }
    return true;
  };

  // ---------- GENERATE KUNDLI ----------

  const generateKundli = async () => {

    setError("");

    if (requireLogin()) return;
    if (!validate()) return;

    setLoading(true);
    setResult(null);

    try {

      const res = await fetch(
        "http://localhost:8080/astro/kundli",
        {
          method: "POST",
          headers: authHeader(),
          body: JSON.stringify(form)
        }
      );

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
      setError("Authentication failed — login again");

    } finally {

      setLoading(false);
    }
  };

  // ---------- DOWNLOAD PDF ----------

  const downloadPdf = async () => {

    setError("");

    if (requireLogin()) return;
    if (!validate()) return;

    try {

      const res = await fetch(
        "http://localhost:8080/astro/kundli/pdf",
        {
          method: "POST",
          headers: authHeader(),
          body: JSON.stringify(form)
        }
      );

      if (res.status === 403) {
        setShowLogin(true);
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error("PDF generation failed");

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
      setError("PDF download failed");

    }
  };

  // ---------- RESET ----------

  const reset = () => {

    setForm({
      name: "",
      dob: "",
      time: "",
      place: ""
    });

    setResult(null);
    setError("");
  };

  // ---------- UI ----------

  return (

    <div className="kundli-page">

      <h2>Kundli Generator 🔮</h2>

      <div className="kundli-form">

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={update}
        />

        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={update}
        />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={update}
        />

        <input
          name="place"
          placeholder="Birth Place"
          value={form.place}
          onChange={update}
        />

        {error && <p className="error">{error}</p>}

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