import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New state for tracking loading status

  useEffect(() => {
    if (user) return; // If user is already set, skip fetching

    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false); // Set loading to false if no token
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER); // ✅ fixed here
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        clearUser(); // Clear user on error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Update token in localStorage
    setLoading(false); // Set loading to false after updating user
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    setLoading(false); // Set loading to false after clearing user
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
