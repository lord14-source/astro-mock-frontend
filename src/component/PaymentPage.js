import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("CARD");

  const handleStripePayment = async () => {
    try {
      const response = await axios.post("http://localhost:8082/flower/checkout", {
        name: "Rose Bouquet",
        currency: "usd",
        amount: 1000,
        quantity: 1,
      });

      const sessionUrl = response.data.sessionUrl;

      if (!sessionUrl) {
        alert("Session URL missing");
        return;
      }

      window.location.assign(sessionUrl);
    } catch (error) {
      alert("Payment failed");
    }
  };

  const handleCOD = async () => {
    try {
      navigate("/success");
    } catch (error) {
      alert("COD failed");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2 className="payment-title">💳 Select Your Payment Method</h2>
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
            <button className="payment-btn" onClick={handleStripePayment}>
              Pay ₹1000
            </button>
          )}
        </div>

        {/* COD */}
        <div className={`payment-option ${paymentMethod === "COD" ? "active" : ""}`}>
          <label>
            <input
              type="radio"
              style={{color:"black",background:"blue"}}
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>
          {paymentMethod === "COD" && (
            <button className="payment-btn cod-btn" onClick={handleCOD}>
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;