import React from 'react'
import UI_IMG from "../../assets/images/auth-img.png"

const AuthLayout = ({ children }) => {
  return (
    <div className="flex w-screen h-screen">
      
      <div className="w-screen md:w-[60vw] px-12 pt-8 pb-12 bg-white bg-opacity-80">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
      </div>

      <div
        className="hidden md:flex w-[40vw] h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${UI_IMG})` }}
      >
        {/* Optional: You can add overlay or text here if needed */}
      </div>

    </div>
  )
}

export default AuthLayout;
