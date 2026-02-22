import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { poojaId, address } = location.state || {};

  if (!address) {
    return (
      <div>
        <h3>No address found</h3>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const handlePayment = () => {
    alert("Payment Successful ✅");
    navigate("/");
  };

  return (
    <div className="page">
      <h2>Payment Summary</h2>

      <div className="summary">
        <p><strong>Pooja ID:</strong> {poojaId}</p>
        <p><strong>Name:</strong> {address.name}</p>
        <p><strong>Phone:</strong> {address.phone}</p>
        <p><strong>City:</strong> {address.city}</p>
        <p><strong>Pincode:</strong> {address.pincode}</p>
      </div>

      <button onClick={handlePayment}>Pay Now 💳</button>
    </div>
  );
}