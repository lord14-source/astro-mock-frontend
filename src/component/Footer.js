import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">

        {/* About Section */}
        <div className="footer-section">
          <h3>Vedic Astro</h3>
          <p>
            Trusted platform for astrology, kundli, horoscope and spiritual
            guidance.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/consult">Consult</Link>
          <Link to="/kundli">Kundli</Link>
          <Link to="/horoscope">Horoscope</Link>
          <Link to="/blog">Blog</Link>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Services</h4>
          <Link to="/talk">Talk to Astrologer</Link>
          <Link to="/chat">Chat with Astrologer</Link>
          <Link to="/pooja">Online Pooja</Link>
          <Link to="/tarot">Tarot Reading</Link>
          <Link to="/numerology">Numerology</Link>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>📍 Mumbai, India</p>
          <p>📞 +91 98765 43210</p>
          <p>✉ support@vedicastro.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Vedic Astro. All Rights Reserved.
      </div>
    </footer>
  );
}