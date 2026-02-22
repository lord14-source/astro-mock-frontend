import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Address.css";

export default function Address() {
  const navigate = useNavigate();
  const { poojaId } = useParams();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:8080/astro/save/${poojaId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify(form)
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save booking");
      }

      const bookingData = await res.json();

      // Navigate to payment page with saved booking
      navigate("/payment", { state: bookingData });

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-page">
      <div className="address-card">
        <h2>🌸 Enter Your Address</h2>
        <p className="subtitle">
          Please provide your details for Pooja booking
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={submit} className="address-form">

          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={update}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={update}
              required
            />
          </div>

          <div className="input-group">
            <textarea
              name="address"
              placeholder="Full Address"
              rows="3"
              value={form.address}
              onChange={update}
              required
            />
          </div>

          <div className="row">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={update}
              required
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={update}
              required
            />
          </div>

          <button
            type="submit"
            className="proceed-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Proceed to Payment →"}
          </button>

        </form>
      </div>
    </div>
  );
}