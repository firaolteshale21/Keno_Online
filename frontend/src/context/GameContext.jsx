import { createContext, useState, useEffect } from "react";
import { fetchGameStatus } from "../services/api";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameStatus, setGameStatus] = useState("inactive");

  useEffect(() => {
    const getStatus = async () => {
      const data = await fetchGameStatus();
      setGameStatus(data.status);
    };
    getStatus();
  }, []);

  return (
    <GameContext.Provider value={{ gameStatus, setGameStatus }}>
      {children}
    </GameContext.Provider>
  );
};
