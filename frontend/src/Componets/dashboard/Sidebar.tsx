import React from 'react'
import Logo from "./Logo"
import UserProfile from './UserProfile';
import Navbar from './Navbar';
import Storage from './Storage';
function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <Logo />

      {/* User Profile */}
      <UserProfile />

      {/* Navigation */}
      <Navbar/>

      {/* Storage */}
      <Storage />
    </div>
  );
}

export default Sidebar