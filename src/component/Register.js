import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Register() {

  const [name, setName] = useState("");
  const [phnno, setPhnno] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ⭐ Generate Stars + Shooting Stars
  useEffect(() => {
    const starContainer = document.querySelector(".star-field");
    const shootingContainer = document.querySelector(".shooting-stars");

    if (starContainer && starContainer.children.length === 0) {
      for (let i = 0; i < 120; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 5 + "s";
        starContainer.appendChild(star);
      }
    }

    const interval = setInterval(() => {
      if (!shootingContainer) return;
      const shoot = document.createElement("div");
      shoot.className = "shoot";
      shoot.style.top = Math.random() * 50 + "%";
      shoot.style.left = "-10%";
      shootingContainer.appendChild(shoot);

      setTimeout(() => shoot.remove(), 4000);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const register = async () => {

    setError("");
    setSuccess("");

    if (!name.trim() || !phnno.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phnno,
            email,
            password
          })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setSuccess("✅ Registration successful!");

      setTimeout(() => {
        window.location = "/";
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="galaxy"></div>
      <div className="star-field"></div>
      <div className="shooting-stars"></div>
      <div className="planet"></div>

      <div className="login-card">

        <h1 className="logo">✨ Register</h1>

        <input
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={phnno}
          onChange={e => setPhnno(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && register()}
        />

        <button onClick={register} disabled={loading}>
          {loading ? "Creating Universe..." : "Register"}
        </button>

        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: "#00ffae" }}>{success}</p>}

        <div className="register-link" style={{ marginTop: "15px" }}>
          <span>Already have an account? </span>
          <Link to="/">Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;