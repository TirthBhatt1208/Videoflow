import React from 'react'
import {
  menuItems,
} from "../../Data/dashboard.ts";
import type { SidebarProps } from "../../Types/dashboard.ts";



function Navbar({activeTab, setActiveTab}: SidebarProps) {
  return (
    <nav className="flex-1 px-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
              activeTab === item.id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-800"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default Navbar