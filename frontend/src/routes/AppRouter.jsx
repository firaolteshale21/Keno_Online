import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import GameInterface from "../pages/GameInterface";
import Transactions from "../pages/Transactions";

import Navbar from "../components/Navbar";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<GameInterface />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
};


export default AppRouter;
