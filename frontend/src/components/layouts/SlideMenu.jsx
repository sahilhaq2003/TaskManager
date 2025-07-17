import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

const SlideMenu = () => {
  const { user } = useContext(UserContext);
  const menuData = user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA;

  return (
    <div className="h-full w-64 bg-white border-r border-gray-100 flex-col hidden md:flex">
      {/* Menu Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <h1 className="text-lg font-medium text-gray-800">Management Portal</h1>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuData.map(({ id, label, icon: Icon, path }) => (
            <li key={id}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors
                  ${isActive 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 font-normal"}`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0 opacity-80" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-100 rounded-full flex justify-center items-center text-gray-600 font-medium text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideMenu;