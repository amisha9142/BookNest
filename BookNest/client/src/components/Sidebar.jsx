import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Dashboard,
  ListAlt,
  HourglassEmpty,
  CheckCircle,
  Settings,
  PendingActions,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import SingleStoreIcon from "../assets/icons/SingleStoreIcon";
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import { logout } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/logout`);
      localStorage.clear();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const activeClassName = "bg-blue-700 text-white";
  const inactiveClassName = "hover:bg-blue-600";

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 shadow-lg flex flex-col">
      <Box className="flex items-center gap-2 mb-6 p-4 bg-gray-800 rounded-lg">
        <SingleStoreIcon className="w-10 h-10" />
        <Typography variant="h5" className="font-bold text-white">
          BookNest
        </Typography>
      </Box>

      <nav className="flex-1">
        <ul className="space-y-4">
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${
                location.pathname === "/dashboard"
                  ? activeClassName
                  : inactiveClassName
              }`}
            >
              <Dashboard fontSize="small" />
              <Typography>Dashboard</Typography>
            </Link>
          </li>

          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard/books"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${
                location.pathname === "/dashboard/books"
                  ? activeClassName
                  : inactiveClassName
              }`}
            >
              <ListAlt fontSize="small" />
              <Typography>All Books</Typography>
            </Link>
          </li>


          <li className="flex items-center rounded-lg p-2">
            <button
              onClick={handleLogout}
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${inactiveClassName}`}
            >
              <LogoutIcon fontSize="small" />
              <Typography>Logout</Typography>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
