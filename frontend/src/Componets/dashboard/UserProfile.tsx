import React from 'react'
import { useUser } from '@clerk/clerk-react';
function UserProfile() {
  const {user} = useUser();
  return (
    <div className="px-4 py-3 mx-4 mb-4 bg-slate-800 rounded-lg flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
        {user?.firstName?.charAt(0).toUpperCase()}
        {user?.lastName?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm">
          {user?.firstName} {user?.lastName}
        </div>
        <div className="text-xs text-gray-400">Video Editor</div>
      </div>
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}

export default UserProfile