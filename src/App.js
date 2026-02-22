import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Blog from "./component/Blog";
import Consult from "./component/Consult";
import Dashboard from "./component/Dashboard";
import Home from "./component/Home";
import Kundali from "./component/Kundli";
import Login from "./component/Login";
import Numerology from "./component/Numerology";
import Register from "./component/Register";
import "./component/styles.css";
import Tarot from "./component/Tarot";



const Protected = ({ children }) => {

  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
};

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/talk" element={<Dashboard />} />
<Route path="/chat" element={<Dashboard />} />
<Route path="/horoscope" element={<Dashboard />} />
<Route path="/kundli" element={<Kundali />} />
<Route path="/consult" element={<Consult />} />
        <Route path="/tarot" element={<Tarot />} />
        <Route path="/numerology" element={<Numerology />} />
        <Route path="/blog" element={<Blog />} />

        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
