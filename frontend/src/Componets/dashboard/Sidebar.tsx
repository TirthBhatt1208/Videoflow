import React from 'react'
import Logo from "./Logo"
import UserProfile from './UserProfile';
import Navbar from './Navbar';
import Storage from './Storage';
import type { SidebarProps } from '../../Types/dashboard.ts';
function Sidebar({activeTab, setActiveTab}: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <Logo />

      {/* User Profile */}
      <UserProfile />

      {/* Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Storage */}
      <Storage />
    </div>
  );
}

export default Sidebar