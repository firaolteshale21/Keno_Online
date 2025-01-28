import React from "react";
import { Link } from "react-router-dom";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <div>
      <h1>Welcome to Keno Game</h1>
      <nav>
        {!token ? (
          <>
            <Link to="/register">Register</Link> |{" "}
            <Link to="/login">Login</Link>
          </>
        ) : (
          <Link to="/logout">Logout</Link>
        )}
      </nav>
    </div>
  );
};

export default App;
