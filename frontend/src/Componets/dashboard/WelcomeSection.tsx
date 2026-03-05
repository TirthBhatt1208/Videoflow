import React from "react";
import { useUser } from "@clerk/clerk-react";

function WelcomeSection() {
  const { user } = useUser();

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.firstName}!
      </h1>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>📅</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}

export default WelcomeSection;
