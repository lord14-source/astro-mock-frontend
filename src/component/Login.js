import { useState } from "react";

function Login({ onSuccess }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password required");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Login failed"
        );
      }

      // ✅ save auth
      localStorage.clear()

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);

      // safety check
      if (!localStorage.getItem("token")) {
        throw new Error("Token save failed");
      }

      // ⭐ popup mode
      if (onSuccess) {

        onSuccess();
        return;
      }

      // ⭐ standalone mode
      window.location = "/";

    } catch (err) {

      console.error("Login error:", err);
      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>🔮 AstroMock</h1>

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
          onKeyDown={e => {
            if (e.key === "Enter") login();
          }}
        />

        <button
          onClick={login}
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

      </div>

    </div>
  );
}

export default Login;
