import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      axios
        .get(`http://localhost:8082/flower/verify-payment?sessionId=${sessionId}`)
        .then((res) => {
          setBookingData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Verification failed", err);
          setLoading(false);
        });
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h2>Verifying Payment...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "60px",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
          textAlign: "center",
          background: "#fff",
        }}
      >
        <h1 style={{ color: "green" }}>🎉 Booking Confirmed!</h1>

        {bookingData ? (
          <>
            <h3>{bookingData.serviceName}</h3>
            <p><strong>Date:</strong> {bookingData.date}</p>
            <p><strong>Time:</strong> {bookingData.time}</p>
            <p><strong>Amount Paid:</strong> ₹{bookingData.amount}</p>
            <p><strong>Booked By:</strong> {bookingData.userName}</p>
          </>
        ) : (
          <p>No booking data found.</p>
        )}

        <p style={{ marginTop: "15px", color: "#555" }}>
          Please be ready at your selected time. Our team will connect with you.
        </p>
      </div>
    </div>
  );
};

export default Success;