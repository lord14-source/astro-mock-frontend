// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./UserHomePage.css";

// const astrologers = [
//   { id: "12", name: "Dr. Sharma", expertise: "Vedic Astrology" },
//   { id: "astro2", name: "Anita Rao", expertise: "Tarot Reading" },
//   { id: "astro3", name: "Rajesh Iyer", expertise: "Palm Reading" },
//   { id: "astro4", name: "Meena Kapoor", expertise: "Numerology" },
//   { id: "astro5", name: "Arjun Verma", expertise: "Horoscope Expert" }
// ];

// function UserHome() {
//   const [userId, setUserId] = useState("");
//   const navigate = useNavigate();

//   const startChat = (astroId) => {
//     if (!userId) {
//       alert("Enter your name first");
//       return;
//     }

//     navigate("/chat", {
//       state: {
//         userId: userId,
//         receiverId: astroId
//       }
//     });
//   };

//   return (
//     <div className="home-container">
//       <input
//         placeholder="Enter your name"
//         value={userId}
//         onChange={(e) => setUserId(e.target.value)}
//       />

//       <div className="card-container">
//         {astrologers.map((astro) => (
//           <div className="astro-card" key={astro.id}>
//             <h3>{astro.name}</h3>
//             <p>{astro.expertise}</p>
//             <button onClick={() => startChat(astro.id)}>
//               Chat Now
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default UserHome;