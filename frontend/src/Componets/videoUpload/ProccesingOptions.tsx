import {useState} from 'react'

function ProccesingOptions() {
    const [generateThumbnails, setGenerateThumbnails] = useState(true);
    const [extractMetadata, setExtractMetadata] = useState(true);
    
    
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
        Processing Options
      </h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <span className="font-medium text-slate-900">
            Generate thumbnails
          </span>
          <button
            onClick={() => setGenerateThumbnails(!generateThumbnails)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              generateThumbnails ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                generateThumbnails ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <span className="font-medium text-slate-900">Extract metadata</span>
          <button
            onClick={() => setExtractMetadata(!extractMetadata)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              extractMetadata ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                extractMetadata ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProccesingOptions