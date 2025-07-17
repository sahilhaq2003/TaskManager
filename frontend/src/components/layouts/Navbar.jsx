import React, { useContext, useState, useRef, useEffect } from "react";
import { HiOutlineMenuAlt2, HiOutlineLogout } from "react-icons/hi";
import { UserContext } from "../../context/userContext";

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-100 z-50">
      <div className="flex justify-between items-center px-5 h-16">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="text-gray-500 hover:bg-gray-50 md:hidden rounded-md p-2 transition-colors"
            aria-label="Toggle menu"
          >
            <HiOutlineMenuAlt2 className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-500 hidden md:inline">
            Dashboard
          </span>
        </div>

        {/* Right Section */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex justify-center items-center text-gray-600 font-medium text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </button>
          
          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-md border border-gray-100 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <HiOutlineLogout className="w-4 h-4 mr-2 opacity-80" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;