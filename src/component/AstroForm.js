import { useState } from "react";
import Toast from "./Toast";

function AstroForm() {

  const [form, setForm] = useState({
    name: "",
    dob: "",
    tob: "",
    location: ""
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    // ✅ Manual Validation
    if (
      !form.name.trim() ||
      !form.dob ||
      !form.tob.trim() ||
      !form.location.trim()
    ) {
      setToastMessage("Please fill all required details");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:8080/astro/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to generate horoscope");
      }

      setResult(data.prediction);

    } catch (err) {
      console.error("Horoscope Error:", err);
      setToastMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-box">

      <form onSubmit={submit}>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
        />

        <input
          name="tob"
          placeholder="Time of birth (HH:MM)"
          value={form.tob}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Horoscope"}
        </button>

      </form>

      {result && (
        <div className="result">
          🔮 {result}
        </div>
      )}

      {/* 🔴 Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />

    </div>
  );
}

export default AstroForm;