import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnUnderline,
  Editor,
  EditorProvider,
  Toolbar
} from "react-simple-wysiwyg";

import Footer from "./Footer";
import Header from "./Header";
import "./Home.css";
import LoginModal from "./Login";
import Toast from "./Toast";

const API_URL = "http://localhost:8080/astro/blog";

export default function Blog() {

  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: ""
  });

  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showLogin, setShowLogin] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setShowLogin(true);
    } else {
      fetchBlogs();
    }
  }, [token]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: "Bearer " + token }
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setToastMessage("Session expired. Please login again.");
        return;
      }

      const data = await res.json().catch(() => []);
      setBlogs(data.reverse());

    } catch (err) {
      console.error("Fetch Blog Error:", err);
      setToastMessage("Failed to load blogs.");
    }
  };

  const handleContentChange = (e) => {
    const html = e.target.value;
    const plain = html.replace(/<[^>]+>/g, "");
    const words = plain.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    setForm({ ...form, content: html });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Manual Validation
    if (!form.title.trim() || !form.author.trim()) {
      setToastMessage("Title and Author are required.");
      return;
    }

    if (!form.content || wordCount < 5) {
      setToastMessage("Blog content must be at least 5 words.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setToastMessage("Session expired. Please login again.");
        return;
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to publish blog.");
      }

      setBlogs([data, ...blogs]);

      setForm({ title: "", content: "", author: "" });
      setWordCount(0);

      setToastMessage("Blog published successfully 🎉");

    } catch (err) {
      console.error("Publish Error:", err);
      setToastMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Header />

      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/">Home</Link>
          <Link to="/consult">Consult</Link>
          <Link to="/pooja">Pooja</Link>
          <Link to="/horoscope">Horoscope</Link>
          <Link to="/kundli">Kundli</Link>
          <Link to="/tarot">Tarot</Link>
          <Link to="/numerology">Numerology</Link>
          <Link to="/blog">Blog</Link>
        </div>
      </nav>

      <section className="container hero">
        <div className="hero-box">
          <h2>📝 Astrology Blog</h2>

          <form onSubmit={handleSubmit}>

            <input
              name="title"
              placeholder="Blog Title"
              value={form.title}
              onChange={handleChange}
              className="modern-input"
            />

            <input
              name="author"
              placeholder="Author Name"
              value={form.author}
              onChange={handleChange}
              className="modern-input"
            />

            <EditorProvider>
              <div className="editor-box">
                <Toolbar>
                  <BtnBold />
                  <BtnItalic />
                  <BtnUnderline />
                  <BtnBulletList />
                  <BtnNumberedList />
                  <BtnLink />
                </Toolbar>

                <Editor
                  value={form.content}
                  onChange={handleContentChange}
                />

                <div className="word-counter">
                  {wordCount} words
                </div>
              </div>
            </EditorProvider>

            <button
              className="modern-btn"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Blog"}
            </button>

          </form>

          <div className="blog-list">
            {blogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                <h3>{blog.title}</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                <small>✍ {blog.author}</small>
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

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />

      <Footer />
    </div>
  );
}