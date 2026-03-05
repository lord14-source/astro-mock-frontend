import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./Login";
import "./PaymentPage.css";

const PaymentPage = () => {

  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* 🔴 Auto hide toaster */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const requireLogin = () => {
    if (!token) {
      setShowLogin(true);
      return true;
    }
    return false;
  };

  /* 💳 STRIPE PAYMENT */
  const handleStripePayment = async () => {

    setError("");

    if (requireLogin()) return;

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/astro/checkout",
        {
          name: "Pooja Booking",
          currency: "inr",
          amount: 1000,
          quantity: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        }
      );

      const sessionUrl = response.data.sessionUrl;

      if (!sessionUrl) {
        setError("❌ Session URL missing");
        return;
      }

      window.location.assign(sessionUrl);

    } catch (error) {

      if (error.response?.status === 401 || error.response?.status === 403) {
        setShowLogin(true);
      } else {
        setError("❌ Payment failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  /* 🚚 CASH ON DELIVERY */
  const handleCOD = () => {

    setError("");

    if (requireLogin()) return;

    navigate("/success");
  };

  return (

    <div className="payment-page">

      <div className="payment-card">

        <h2 className="payment-title">
          💳 Select Your Payment Method
        </h2>

        <p className="payment-subtitle">
          Please choose a payment method for your Pooja booking
        </p>

        {/* CARD / UPI */}
        <div className={`payment-option ${paymentMethod === "CARD" ? "active" : ""}`}>

          <label>
            <input
              type="radio"
              checked={paymentMethod === "CARD"}
              onChange={() => setPaymentMethod("CARD")}
            />
            Credit / Debit Card / UPI
          </label>

          {paymentMethod === "CARD" && (
            <button
              className="payment-btn"
              onClick={handleStripePayment}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Processing..." : "Pay ₹1000"}
            </button>
          )}
        </div>

        {/* COD */}
        <div className={`payment-option ${paymentMethod === "COD" ? "active" : ""}`}>

          <label>
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>

          {paymentMethod === "COD" && (
            <button
              className="payment-btn cod-btn"
              onClick={handleCOD}
            >
              Place Order
            </button>
          )}
        </div>

      </div>

      {/* 🔴 Bottom Center Toaster */}
      {error && (
        <div className="bottom-toast">
          {error}
        </div>
      )}

      {showLogin && (
        <LoginModal
          onClose={() => {
            setShowLogin(false);
          }}
        />
      )}

    </div>
  );
};

export default PaymentPage;