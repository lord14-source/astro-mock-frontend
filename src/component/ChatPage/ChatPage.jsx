// import { useEffect, useState } from "react";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";
// import axios from "axios";
// import "./ChatPage.css";
// import { useLocation } from "react-router-dom";

// function ChatPage() {
//   const location = useLocation();

//   const userId = localStorage.getItem("userId") || "1234567890";
//   const receiverId = location.state?.receiverId;

//   const [stompClient, setStompClient] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");

//   const conversationId =
//     userId < receiverId
//       ? `${userId}_${receiverId}`
//       : `${receiverId}_${userId}`;

//   useEffect(() => {
//     if (!receiverId) return;

//     // Load chat history
//     axios
//       .get(
//         `http://localhost:8081/api/chat/history?user1=${userId}&user2=${receiverId}`
//       )
//       .then((res) => setMessages(res.data))
//       .catch((err) => console.error(err));

//     const socket = new SockJS("http://localhost:8081/chat");

//     const client = new Client({
//       webSocketFactory: () => socket,
//       reconnectDelay: 5000,
//       onConnect: () => {
//         client.subscribe(`/topic/chat/${conversationId}`, (msg) => {
//           const receivedMessage = JSON.parse(msg.body);

//           setMessages((prev) => {
//             // prevent duplicate message
//             const exists = prev.some(
//               (m) =>
//                 m.content === receivedMessage.content &&
//                 m.senderId === receivedMessage.senderId &&
//                 m.receiverId === receivedMessage.receiverId
//             );

//             if (exists) return prev;
//             return [...prev, receivedMessage];
//           });
//         });
//       },
//     });

//     client.activate();
//     setStompClient(client);

//     return () => {
//       client.deactivate(); // important cleanup
//     };
//   }, [receiverId, conversationId, userId]);

//   const sendMessage = () => {
//     if (!message.trim() || !stompClient) return;

//     stompClient.publish({
//       destination: "/app/privateMessage",
//       body: JSON.stringify({
//         senderId: userId,
//         receiverId: receiverId,
//         content: message,
//       }),
//     });

//     setMessage("");
//   };

//   return (
//     <div className="chat-wrapper">
//       <div className="chat-container">
//         <div className="chat-header">
//           Chat with {receiverId}
//         </div>

//         <div className="chat-messages">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`message-row ${
//                 String(msg.senderId) === String(userId)
//                   ? "sent"
//                   : "received"
//               }`}
//             >
//               <div className="message">
//                 {msg.content}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="chat-input-area">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type a message..."
//           />
//           <button className="send-button" onClick={sendMessage}>
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatPage;



import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "./ChatPage.css";
import { useLocation } from "react-router-dom";

function ChatPage() {
  const location = useLocation();

  const userId = localStorage.getItem("userId") || "1234567890";
  const receiverId = location.state?.receiverId;

  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null); // 👈 For auto scroll

  const conversationId =
    userId < receiverId
      ? `${userId}_${receiverId}`
      : `${receiverId}_${userId}`;

  /* =============================
     AUTO SCROLL FUNCTION
  ============================== */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* =============================
     LOAD CHAT + CONNECT SOCKET
  ============================== */
  useEffect(() => {
    if (!receiverId) return;

    // Load old messages
    axios
      .get(
        `http://localhost:8082/api/chat/history?user1=${userId}&user2=${receiverId}`
      )
      .then((res) => {
        setMessages(res.data);
      });

    const socket = new SockJS("http://localhost:8082/chat");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/chat/${conversationId}`, (msg) => {
          const received = JSON.parse(msg.body);
          setMessages((prev) => [...prev, received]);
        });
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [receiverId]);

  /* =============================
     AUTO SCROLL WHEN MESSAGES CHANGE
  ============================== */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* =============================
     SEND MESSAGE
  ============================== */
  const sendMessage = () => {
    if (!message.trim() || !stompClient) return;

    stompClient.publish({
      destination: "/app/privateMessage",
      body: JSON.stringify({
        senderId: userId,
        receiverId: receiverId,
        content: message,
      }),
    });

    setMessage("");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          Chat with {receiverId}
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-row ${
                String(msg.senderId) === String(userId)
                  ? "sent"
                  : "received"
              }`}
            >
              <div className="message">{msg.content}</div>
            </div>
          ))}

          {/* 👇 Invisible div for auto scroll */}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <div className="send-button" onClick={sendMessage}>
            Send
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;