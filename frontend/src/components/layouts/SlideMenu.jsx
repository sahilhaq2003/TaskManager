import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

const SlideMenu = () => {
  const { user } = useContext(UserContext);
  const menuData = user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA;

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white shadow-lg border-r border-gray-200/50 sticky top-[61px] flex flex-col justify-between">

      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center mb-7 pt-6 px-4">
        <div className="relative group">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300 ease-in-out bg-slate-400"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/default-avatar.png";
              }}
            />
          ) : (
            <div className="w-20 h-20 bg-slate-400 rounded-full flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-105 transition-transform duration-300 ease-in-out">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-800">Hello, {user?.name}!</p>
        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuData.map(({ id, label, icon: Icon, path }) => (
            <li key={id}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0 opacity-80" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 text-center bg-gray-50 rounded-b-lg">
        <p className="text-xs text-gray-500">© 2025 Developed By Sahil Haq.<br/> All rights reserved.</p>
      </div>
    </div>
  );
};

export default SlideMenu;
