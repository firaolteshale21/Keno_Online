import AppRouter from "./routes/AppRouter";
import { UserProvider } from "./context/UserContext"; // ✅ Import UserProvider

function App() {
  return (
     <UserProvider>
    <div className="min-h-screen bg-gray-900 text-white">
      <AppRouter />
    </div>
     </UserProvider>
  );
}

export default App;
