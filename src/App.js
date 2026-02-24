import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Address from "./component/Address";
import Blog from "./component/Blog";
import Consult from "./component/Consult";
import Dashboard from "./component/Dashboard";
import Footer from "./component/Footer";
import Home from "./component/Home";
import Kundali from "./component/Kundli";
import Login from "./component/Login";
import Numerology from "./component/Numerology";
import Payment from "./component/PaymentPage";
import Pooja from "./component/Pooja";
import Register from "./component/Register";
import "./component/styles.css";
import Success from "./component/Success";
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
<Route path="/pooja" element={<Pooja />} />

        <Route path="/tarot" element={<Tarot />} />
        <Route path="/numerology" element={<Numerology />} />
        <Route path="/blog" element={<Blog/>} />
         <Route path="/address/:poojaId" element={<Address />} />
          <Route path="/payment" element={<Payment />} />
                  <Route path="/success" element={<Success />} />
                                    <Route path="/footer" element={<Footer />} />



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
