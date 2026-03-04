import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ onSuccess }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ⭐ Background Stars (your original effect kept)
  useEffect(() => {
    const starContainer = document.querySelector(".star-field");
    const shootingContainer = document.querySelector(".shooting-stars");

    if (!starContainer || !shootingContainer) return;

    for (let i = 0; i < 120; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.top = Math.random() * 100 + "%";
      star.style.left = Math.random() * 100 + "%";
      star.style.animationDelay = Math.random() * 5 + "s";
      starContainer.appendChild(star);
    }

    const interval = setInterval(() => {
      const shoot = document.createElement("div");
      shoot.className = "shoot";
      shoot.style.top = Math.random() * 50 + "%";
      shoot.style.left = "-10%";
      shootingContainer.appendChild(shoot);

      setTimeout(() => shoot.remove(), 4000);
    }, 2500);

    return () => clearInterval(interval);

  }, []);

  // 🔐 LOGIN FUNCTION
  const login = async () => {

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ Store in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);

      if (onSuccess) onSuccess(data);

      navigate("/"); // redirect to home

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
        <h1 className="logo">🔮 AstroMock</h1>

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
          onKeyDown={e => e.key === "Enter" && login()}
        />

        <button onClick={login} disabled={loading}>
          {loading ? "Entering Universe..." : "Login"}
        </button>

        {error && <p className="error">{error}</p>}

        <div className="register-link">
          <span>Don't have an account? </span>
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;