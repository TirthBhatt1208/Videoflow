import React from 'react'
import {Upload} from "lucide-react"

function QuickUpload() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Upload</h2>
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        <div className="font-medium text-gray-900 mb-1">Drop files here</div>
        <div className="text-sm text-gray-500">or click to browse</div>
      </div>
    </div>
  );
}

export default QuickUpload