import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-center space-x-6 text-white">
        <li>
          <Link to="/register" className="hover:text-yellow-500">
            Register
          </Link>
        </li>
        <li>
          <Link to="/login" className="hover:text-yellow-500">
            Login
          </Link>
        </li>
        <li>
          <Link to="/game" className="hover:text-yellow-500">
            Game
          </Link>
        </li>
        <li>
          <Link to="/transactions" className="hover:text-yellow-500">
            Transactions
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
