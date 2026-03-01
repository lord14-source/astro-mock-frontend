import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./Login";
import "./PaymentPage.css";

const PaymentPage = () => {

  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [showLogin, setShowLogin] = useState(false);

  const token = localStorage.getItem("token");

  const handleStripePayment = async () => {

    if (!token) {
      setShowLogin(true);
      return;
    }

    try {

      const response = await axios.post(
        "http://localhost:8080/astro/checkout",
        {
          name: "Rose Bouquet",
          currency: "usd",
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
        alert("Session URL missing");
        return;
      }

      window.location.assign(sessionUrl);

    } catch (error) {

      if (error.response?.status === 403) {
        setShowLogin(true);
      } else {
        alert("Payment failed");
      }
    }
  };

  const handleCOD = () => {

    if (!token) {
      setShowLogin(true);
      return;
    }

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
            >
              Pay ₹1000
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