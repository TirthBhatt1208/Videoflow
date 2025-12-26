import React from 'react'
import { useUser } from '@clerk/clerk-react';
function WelcomeSection() {
  const {user} = useUser();
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.firstName}!
      </h1>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>📅</span>
        <span>Monday, October 24th, 2023</span>
        <span className="ml-auto">Last login: 2 hours ago</span>
      </div>
    </div>
  );
}

export default WelcomeSection