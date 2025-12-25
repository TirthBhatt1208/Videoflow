import React from 'react'
import { Video } from "lucide-react";

function Logo() {
  return (
    <div className="p-6 flex items-center gap-3">
      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
        <Video className="w-6 h-6" />
      </div>
      <span className="text-xl font-bold">VideoFlow</span>
    </div>
  );
}

export default Logo