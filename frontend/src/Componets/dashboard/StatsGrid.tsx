import React from 'react'
import {
  stats,
} from "../../Data/dashboard.ts";


function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${stat.badgeColor}`}
                      >
                        {stat.badge}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                );
              })}
            </div>
  )
}

export default StatsGrid