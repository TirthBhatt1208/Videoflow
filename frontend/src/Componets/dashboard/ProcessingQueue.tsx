import React from 'react'
import {
  processingJobs,
} from "../../Data/dashboard.ts";
import { X } from "lucide-react";

function ProcessingQueue() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Processing Queue</h2>
          <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
            3 Active
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {processingJobs.map((job) => (
            <div key={job.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {job.name}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 capitalize">
                  {job.status}...
                </span>
                <span className="text-gray-500">{job.timeRemaining}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          View all jobs
        </button>
      </div>
    </div>
  );
}

export default ProcessingQueue