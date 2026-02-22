import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
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
    width: "120px", // ✅ fixed width (all identical)
    marginTop:"10px"
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
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
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
              <Link to="/dashboard" style={authButtonStyle}>
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