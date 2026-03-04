import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import "./Consult.css";
import Footer from "./Footer";
import Header from "./Header";
import LoginModal from "./Login";

export default function Consult() {

  const [form, setForm] = useState({
    question: "",
    category: ""
  });

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello ✨ I am Astro AI.\nAsk me about Career, Marriage, Finance or Health."
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const messagesEndRef = useRef(null);

  /* -------------------- Effects -------------------- */

  useEffect(() => {
    if (!token) setShowLogin(true);
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* -------------------- Helpers -------------------- */

  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  });

  const requireLogin = () => {
    if (!token) {
      setShowLogin(true);
      return true;
    }
    return false;
  };

  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    if (!form.question.trim() || !form.category) {
      setError("Please complete all fields");
      return false;
    }
    return true;
  };

  /* -------------------- Submit -------------------- */

  const submitConsult = async () => {

    setError("");

    if (requireLogin()) return;
    if (!validate()) return;

    const userMessage = {
      sender: "user",
      text: form.question
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {

      const data = await apiRequest(
        "http://localhost:8080/astro/consult",
        {
          method: "POST",
          headers: authHeader(),
          body: JSON.stringify(form)
        }
      );

      const aiMessage = {
        sender: "ai",
        text: `Advisor: ${data.advisor}

Guidance: ${data.guidance}

Remedy: ${data.remedy}`
      };

      setMessages(prev => [...prev, aiMessage]);

      // Reset form
      setForm({
        question: "",
        category: ""
      });

    } catch (err) {

      console.error("API Error:", err);

      if (err.status === 400) {
        setError(err.message);
      }
      else if (err.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setShowLogin(true);
      }
      else if (err.status === 402) {
        setError("Premium subscription required 💎");
      }
      else if (err.status === 403) {
        setError("Access denied 🚫");
      }
      else {
        setError("Server error. Please try again later.");
      }

    } finally {
      setLoading(false);
    }
  };

  /* -------------------- Enter Key -------------------- */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitConsult();
    }
  };

  /* -------------------- UI -------------------- */

  return (

    <div className="consult-page">

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

      <div className="chat-container">

        {/* Messages */}
        <div className="chat-messages">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.sender}`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="chat-bubble ai typing">
              Astro AI is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />

        </div>

        {/* Input Section */}
        <div className="chat-input">

          <textarea
            name="question"
            placeholder="Ask Astro AI anything..."
            value={form.question}
            onChange={update}
            onKeyDown={handleKeyDown}
          />

          <div className="chat-actions">

            <select
              name="category"
              value={form.category}
              onChange={update}
            >
              <option value="">Category</option>
              <option value="Career">Career</option>
              <option value="Marriage">Marriage</option>
              <option value="Finance">Finance</option>
              <option value="Health">Health</option>
            </select>

            <button
              onClick={submitConsult}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>

          </div>

        </div>

        {error && <p className="error">{error}</p>}

      </div>

      {showLogin && (
        <LoginModal
          onClose={() => {
            const savedToken = localStorage.getItem("token");
            setToken(savedToken);
            setShowLogin(false);
          }}
        />
      )}

      <Footer />

    </div>
  );
}