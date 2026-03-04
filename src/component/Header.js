import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const [name, setName] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setName(null);
    navigate("/");
    window.location.reload();
  };

  const authButtonStyle = {
    background: "#facc15",
    padding: "8px 0",
    borderRadius: "6px",
    textDecoration: "none",
    color: "#000",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    width: "120px",
    marginTop: "10px"
  };

  return (
    <header
      style={{
        width: "100%",
        background: "rgba(0,0,0,0.9)",
        borderBottom: "1px solid #444",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          color: "#fff",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            textDecoration: "none",
            color: "#facc15",
          }}
        >
          🔮 Astro-Mock
        </Link>

        {/* Right Section */}
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          
          {!token ? (
            <>
              <Link to="/login" style={authButtonStyle}>
                Login
              </Link>

              <Link to="/register" style={authButtonStyle}>
                Register
              </Link>
            </>
          ) : (
            <>
              {/* 👇 Greeting */}
              {name && (
                <span style={{ color: "#facc15", fontWeight: "600" }}>
                  Hi, {name} 👋
                </span>
              )}

              <Link to="/" style={authButtonStyle}>
                Dashboard
              </Link>

              <button onClick={handleLogout} style={authButtonStyle}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;