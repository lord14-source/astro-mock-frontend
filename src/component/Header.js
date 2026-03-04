import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";

function Header() {
  const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setName(storedName);
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setShowProfile(false);
    navigate("/");
  };

  return (
    <>
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

          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            {!token ? (
              <>
                <Link to="/login" style={authButtonStyle}>Login</Link>
                <Link to="/register" style={authButtonStyle}>Register</Link>
              </>
            ) : (
              <>
                <span
                  onClick={() => setShowProfile(true)}
                  style={{
                    color: "#facc15",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Hi, {name} 👋
                </span>

                <Link to="/" style={authButtonStyle}>
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        name={name}
        email={email}
        onLogout={handleLogout}
      />
    </>
  );
}

const authButtonStyle = {
  background: "#facc15",
  padding: "8px 16px",
  borderRadius: "6px",
  textDecoration: "none",
  color: "#000",
  fontWeight: 600
};

export default Header;