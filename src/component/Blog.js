import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./Home.css";
import LoginModal from "./Login";

const API_URL = "http://localhost:8080/astro/blog";

export default function Blog() {

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  /* 🔐 Auto logout handler */
  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    setToken(null);
    setShowLogin(true);
  };

  useEffect(() => {
    if (!token) {
      setShowLogin(true);
    } else {
      fetchBlogs();
    }
  }, [token]);

  /* 📡 FETCH BLOGS */
  const fetchBlogs = async () => {

    if (!token) return;

    setLoading(true);
    setError("");

    try {

      await sleep(400);

      const res = await fetch(API_URL, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setBlogs(data);

    } catch (err) {
      console.error(err);
      setError("Unable to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  /* ✍ HANDLE FORM CHANGE */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ➕ ADD BLOG */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setShowLogin(true);
      return;
    }

    setLoading(true);
    setError("");

    try {

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error("Failed");

      setForm({ title: "", content: "", author: "" });
      fetchBlogs();

    } catch (err) {
      console.error(err);
      setError("Unable to add blog.");
    } finally {
      setLoading(false);
    }
  };

  /* ❌ DELETE BLOG */
  const handleDelete = async (id) => {

    if (!token) {
      setShowLogin(true);
      return;
    }

    try {

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token
        }
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        throw new Error("Unauthorized");
      }

      fetchBlogs();

    } catch (err) {
      console.error(err);
      setError("Unable to delete blog.");
    }
  };

  return (
    <div className="page">

      <Header />

      {/* 🔥 Loader */}
      {loading && (
        <div className="loader-overlay">
          <div className="divine-loader">
            <div className="ring"></div>
            <div className="ring glow"></div>
          </div>
          <p className="loader-text">
            Loading Blog Content<span className="dots">...</span>
          </p>
        </div>
      )}

      <section className="container hero">
        <div className="hero-box">

          <h2>📝 Astrology Blog</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: "25px" }}>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
              style={inputStyle}
              disabled={loading}
            />

            <textarea
              name="content"
              placeholder="Content"
              value={form.content}
              onChange={handleChange}
              required
              style={{ ...inputStyle, height: "100px" }}
              disabled={loading}
            />

            <input
              type="text"
              name="author"
              placeholder="Author"
              value={form.author}
              onChange={handleChange}
              required
              style={inputStyle}
              disabled={loading}
            />

            <button
              type="submit"
              style={{
                ...buttonStyle,
                opacity: loading ? 0.6 : 1
              }}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Blog"}
            </button>

          </form>

          {error && (
            <p style={{ color: "#ff4d4f", marginTop: "15px" }}>
              {error}
            </p>
          )}

          {/* Blog List */}
          <div style={{ marginTop: "40px" }}>
            {blogs.map((blog) => (
              <div key={blog.id} style={resultBox} className="fade-in">
                <h3>{blog.title}</h3>
                <p>{blog.content}</p>
                <small>
                  ✍ {blog.author} | {blog.createdAt}
                </small>
                <br /><br />
                <button
                  onClick={() => handleDelete(blog.id)}
                  style={{ ...buttonStyle, backgroundColor: "red" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {showLogin && (
        <LoginModal
          onClose={() => {
            setToken(localStorage.getItem("token"));
            setShowLogin(false);
          }}
        />
      )}

      <Footer />

    </div>
  );
}

/* ---------- STYLES ---------- */

const inputStyle = {
  padding: "12px",
  margin: "10px",
  borderRadius: "10px",
  border: "1px solid #e72d2d",
  width: "260px",
  fontSize: "14px"
};

const buttonStyle = {
  padding: "12px 25px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#6c5ce7",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
  transition: "0.3s"
};

const resultBox = {
  marginTop: "20px",
  padding: "20px",
  background: "linear-gradient(135deg, #de7534, #6c5ce7)",
  borderRadius: "15px",
  color: "white",
  animation: "fadeIn 0.5s ease-in-out"
};