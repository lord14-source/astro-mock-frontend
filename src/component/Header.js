import { Link } from "react-router-dom";

function Header() {
  const token = localStorage.getItem("token");

  return (
    <header
      style={{
        width: "100%",
        background: "rgba(0,0,0,0.85)",
        borderBottom: "1px solid #444",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          color: "#fff",
        }}
      >
        {/* LEFT — Logo */}
        <Link
          to="/"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            textDecoration: "none",
            color: "#facc15",
          }}
        >
          🔮 Astro-Mock
        </Link>

        {/* RIGHT — Auth buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {!token ? (
            <>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  fontWeight: 500,
                }}
              >
                Login
              </Link>

              <Link
                to="/register"
                style={{
                  background: "#facc15",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  color: "#000",
                  fontWeight: 600,
                }}
              >
                Register
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              style={{
                background: "#facc15",
                padding: "6px 12px",
                borderRadius: "6px",
                textDecoration: "none",
                color: "#000",
                fontWeight: 600,
              }}
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
