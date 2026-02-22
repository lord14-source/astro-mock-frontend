import { useEffect, useState } from "react";
import "./Consult.css";
import LoginModal from "./Login";

export default function Consult() {

  const [form, setForm] = useState({
    question: "",
    category: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

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
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    if (!form.question || !form.category) {
      setError("Please complete all fields");
      return false;
    }
    return true;
  };

  const submitConsult = async () => {

    setError("");

    if (requireLogin()) return;
    if (!validate()) return;

    setLoading(true);
    setResult(null);

    try {

      const res = await fetch(
        "http://localhost:8080/astro/consult",
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

      if (!res.ok) throw new Error();

      const data = await res.json();
      setResult(data);

    } catch (err) {

      console.error(err);
      setError("Consult failed — login again");

    } finally {

      setLoading(false);
    }
  };

  const reset = () => {
    setForm({ question: "", category: "" });
    setResult(null);
    setError("");
  };

  return (

    <div className="consult-page">

      <h2>Astrology Consult 🔮</h2>

      <div className="consult-form">

        <textarea
          name="question"
          placeholder="Ask your question..."
          value={form.question}
          onChange={update}
        />

        <select
          name="category"
          value={form.category}
          onChange={update}
        >
          <option value="">Select Category</option>
          <option>Career</option>
          <option>Marriage</option>
          <option>Finance</option>
          <option>Health</option>
        </select>

        {error && <p className="error">{error}</p>}

        <button onClick={submitConsult} disabled={loading}>
          {loading ? "Consulting..." : "Consult Now"}
        </button>

        <button className="reset-btn" onClick={reset}>
          Reset
        </button>

      </div>

      {result && (

        <div className="consult-result">

          <h3>Your Guidance</h3>

          <p><b>Advisor:</b> {result.advisor}</p>
          <p><b>Guidance:</b> {result.guidance}</p>
          <p><b>Remedy:</b> {result.remedy}</p>

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