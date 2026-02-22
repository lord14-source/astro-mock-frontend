import { useState } from "react";

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const register = async () => {

    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password required");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Registration failed"
        );
      }

      setSuccess("✅ Registration successful!");

      // optional redirect after delay
      setTimeout(() => {
        window.location = "/";
      }, 1500);

    } catch (err) {

      console.error(err);
      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>✨ Register</h1>

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
            if (e.key === "Enter") register();
          }}
        />

        <button
          onClick={register}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: "green" }}>
            {success}
          </p>
        )}

      </div>

    </div>
  );
}

export default Register;
