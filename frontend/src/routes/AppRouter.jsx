import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import GameInterface from "../pages/GameInterface";
import Transactions from "../pages/Transactions";
import Navbar from "../components/Navbar";
import { UserProvider } from "../context/UserContext"; // ✅ Import UserProvider
import { GameProvider } from "../context/GameContext"; // ✅ Import GameProvider

const AppRouter = () => {
  return (
    <UserProvider>
      <GameProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/game" element={<GameInterface />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </Router>
      </GameProvider>
    </UserProvider>
  );
};


export default AppRouter;
