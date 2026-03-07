


import { useNavigate } from "react-router-dom";
import "./Astrologer.css";

const users = ["akshaydube2002@gmail.com", "1234", "12345"];

function Astrologer() {
  const navigate = useNavigate();

  const astrologerId = "9876543210";
  localStorage.setItem("userId", astrologerId);

  return (
    <div className="astro-page">   {/* VERY IMPORTANT WRAPPER */}
      <div className="astro-header">
        Astrologer Dashboard : Welcome Astro Gaurav Acharya
      </div>
      

      <div className="astro-container">
        {users.map((user) => (
          <div key={user} className="astro-card">
            <div className="astro-user">
              User ID: {user}
            </div>

            <button
              className="astro-btn"
              onClick={() =>
                navigate("/chat", {
                  state: { receiverId: user }
                })
              }
            >
              Open Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Astrologer;