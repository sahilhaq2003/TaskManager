import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

const SlideMenu = () => {
  const { user } = useContext(UserContext);
  const menuData = user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA;

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] flex flex-col justify-between">

      {/* Profile Image Section */}
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover bg-slate-400"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default-avatar.png";
            }}
          />
        ) : (
          <div className="w-20 h-20 bg-slate-400 rounded-full flex items-center justify-center text-white text-xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuData.map(({ id, label, icon: Icon, path }) => (
            <li key={id}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 font-normal"
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

      {/* User Name and Role */}
      <div className="p-4 border-t border-gray-100 text-center">
        <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
      </div>
    </div>
  );
};

export default SlideMenu;
