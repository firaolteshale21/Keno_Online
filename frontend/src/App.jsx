import AppRouter from "./routes/AppRouter";
import { UserProvider } from "./context/UserContext"; // ✅ Import UserProvider
import { GameProvider } from "./context/GameContext"; // ✅ Import GameProvider


function App() {
  return (
  
      <GameProvider>
        <UserProvider>
          <div className="min-h-screen bg-gray-900 text-white">
            <AppRouter />
          </div>
        </UserProvider>
      </GameProvider>
    
  );
}

export default App;
