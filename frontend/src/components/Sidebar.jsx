import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/useAuth";

// NEW: matches the base URL your fetchClient.js already uses
const API_BASE_URL = "http://localhost:8080";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Account";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  // NEW: builds the full image URL from the relative path stored in
  // user.ProfilePicture. WHY the ternary: ProfilePicture is null for
  // users who haven't uploaded a photo, so we only build a URL when
  // one actually exists — avoids requesting "http://localhost:8080null".
  const profilePicUrl = user?.ProfilePicture
    ? `${API_BASE_URL}${user.ProfilePicture}`
    : null;

  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm flex flex-col">

      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold text-purple-600">
          CarPooling
        </h1>
      </div>

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
        {user?.role === "DRIVER" && (
        <NavLink
          to="/ride-requests"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition ${
              isActive
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Ride Requests
        </NavLink>
      )}

        <NotificationBell />

      </nav>

      <div ref={menuRef} className="relative border-t p-3">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          {/* CHANGED: shows the real photo when available, otherwise falls back to initials */}
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
          )}
          <span className="flex-1 text-left text-sm font-medium text-gray-800 truncate">
            {displayName}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white border rounded-xl shadow-lg overflow-hidden">
            <NavLink
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <User size={16} />
              My Profile
            </NavLink>
            <NavLink
              to="/settings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-t"
            >
              <Settings size={16} />
              Settings
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Sidebar;