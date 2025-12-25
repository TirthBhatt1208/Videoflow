import React from 'react'
import { Video } from "lucide-react";
import {recentVideos, getStatusBadge } from "../../Data/dashboard.ts";
function Recentactivity() {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recentVideos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div
                className={`w-20 h-14 ${video.thumbnail} rounded-lg flex items-center justify-center`}
              >
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {video.name}
                </div>
                <div className="text-sm text-gray-500">
                  {video.size} • {video.format}
                </div>
              </div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                  video.status
                )}`}
              >
                {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
              </span>
              <div className="text-sm text-gray-500 w-20 text-center">
                {video.duration}
              </div>
              <div className="text-sm text-gray-500 w-24 text-right">
                {video.uploadedAt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recentactivity