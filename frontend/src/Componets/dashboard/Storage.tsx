import React from 'react'
import {dashBoardStats} from "../../Store/store"
function Storage() {
  const {UsedStorage}  = dashBoardStats()
  return (
    <div className="p-4 m-4 bg-slate-800 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Storage</span>
        <span className="text-xs text-gray-400">{UsedStorage.toFixed(4)}GB / 10GB</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ width: `${UsedStorage * 10}%` }}
        />
      </div>
      <button className="w-full mt-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
        Upgrade Plan
      </button>
    </div>
  );
}

export default Storage