import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm flex flex-col">

      {/* Logo / Brand */}
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold text-purple-600">
          CarPooling
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition ${
              isActive
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition ${
              isActive
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          My Profile
        </NavLink>

        <NavLink
          to="/ride-management"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition ${
              isActive
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Ride Management
        </NavLink>


      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-xs text-gray-400">
        v1.0.0
      </div>

    </div>
  );
};

export default Sidebar;