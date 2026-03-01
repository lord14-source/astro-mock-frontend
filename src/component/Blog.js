import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!token) setShowLogin(true);
    else fetchBlogs();
  }, [token]);

  const fetchBlogs = async () => {
    const res = await fetch(API_URL, {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    setBlogs(data.reverse());
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

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(form)
    });

    const newBlog = await res.json();
    setBlogs([newBlog, ...blogs]);

    setForm({ title: "", content: "", author: "" });
    setWordCount(0);
  };

  return (
    <div className="page">
      <Header />

      <section className="container hero">
        <div className="hero-box">
          <h2>📝 Astrology Blog </h2>

          <form onSubmit={handleSubmit}>

            <input
              name="title"
              placeholder="Blog Title"
              value={form.title}
              onChange={handleChange}
              required
              className="modern-input"
            />

            <input
              name="author"
              placeholder="Author Name"
              value={form.author}
              onChange={handleChange}
              required
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

            <button className="modern-btn">
              Publish Blog
            </button>

          </form>

          <div className="blog-list">
            {blogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                <h3>{blog.title}</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                <small>
                  ✍ {blog.author}
                </small>
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