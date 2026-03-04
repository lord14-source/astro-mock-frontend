import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Address.css";
import Toast from "./Toast";

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
  const [toastMessage, setToastMessage] = useState("");

  const token = localStorage.getItem("token");

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    // ✅ Manual Validation
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.pincode.trim()
    ) {
      setToastMessage("Please fill all required details");
      return;
    }

    // Phone validation (10 digits)
    if (!/^[0-9]{10}$/.test(form.phone)) {
      setToastMessage("Enter valid 10-digit phone number");
      return;
    }

    // Pincode validation (6 digits)
    if (!/^[0-9]{6}$/.test(form.pincode)) {
      setToastMessage("Enter valid 6-digit pincode");
      return;
    }

    if (!token) {
      setToastMessage("Please login to continue");
      return;
    }

    setLoading(true);

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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save booking");
      }

      // ✅ Navigate to payment page
      navigate("/payment", { state: data });

    } catch (err) {
      console.error("Address Save Error:", err);
      setToastMessage(err.message || "Something went wrong. Please try again.");
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

        <form onSubmit={submit} className="address-form">

          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={update}
            />
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={update}
            />
          </div>

          <div className="input-group">
            <textarea
              name="address"
              placeholder="Full Address"
              rows="3"
              value={form.address}
              onChange={update}
            />
          </div>

          <div className="row">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={update}
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={update}
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

      {/* 🔴 Toast Component */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />

    </div>
  );
}