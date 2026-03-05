import { useEffect, useState } from "react";

function ProfileModal({ isOpen, onClose, onLogout }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phnno: ""
  });

  // 🔥 Fetch Profile
  useEffect(() => {
    if (!isOpen) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/astro/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        setUser(data);
        setFormData({
          name: data.name,
          phnno: data.phnno
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

  }, [isOpen]);

  // 🔥 Save Updated Profile
  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/astro/profileupdate", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();

      setUser(updated);
      setEditMode(false);
      setSuccess("✅ Profile updated successfully!");

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>

        <h2 style={{ color: "#facc15" }}>👤 Cosmic Profile</h2>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "lightgreen" }}>{success}</p>}

        {user && !editMode && (
          <>
            <div style={field}>
              <strong>Name:</strong>
              <p>{user.name}</p>
            </div>

            <div style={field}>
              <strong>Email:</strong>
              <p>{user.email}</p>
            </div>

            <div style={field}>
              <strong>Phone:</strong>
              <p>{user.phnno}</p>
            </div>
          </>
        )}

        {editMode && (
          <>
            <div style={field}>
              <strong>Name:</strong>
              <input
                style={input}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div style={field}>
              <strong>Phone:</strong>
              <input
                style={input}
                value={formData.phnno}
                onChange={(e) =>
                  setFormData({ ...formData, phnno: e.target.value })
                }
              />
            </div>
          </>
        )}

        {/* Buttons */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
          {!editMode ? (
            <button style={buttonStyle} onClick={() => setEditMode(true)}>
              Edit
            </button>
          ) : (
            <>
              <button
                style={buttonStyle}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                style={cancelStyle}
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </>
          )}

          <button
            style={logoutStyle}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>

        <button onClick={onClose} style={closeStyle}>
          Close
        </button>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.8)",
  backdropFilter: "blur(8px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000
};

const modalStyle = {
  width: "400px",
  padding: "30px",
  borderRadius: "18px",
  background: "rgba(20,20,30,0.95)",
  border: "1px solid rgba(250,204,21,0.5)",
  boxShadow: "0 0 30px rgba(250,204,21,0.3)",
  color: "#fff",
  textAlign: "center"
};

const field = {
  marginBottom: "15px"
};

const input = {
  width: "100%",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #555",
  background: "#111",
  color: "#fff",
  marginTop: "5px"
};

const buttonStyle = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#facc15",
  fontWeight: 600,
  cursor: "pointer"
};

const cancelStyle = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#6b7280",
  color: "#fff",
  cursor: "pointer"
};

const logoutStyle = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer"
};

const closeStyle = {
  marginTop: "20px",
  background: "transparent",
  border: "none",
  color: "#aaa",
  cursor: "pointer"
};

export default ProfileModal;