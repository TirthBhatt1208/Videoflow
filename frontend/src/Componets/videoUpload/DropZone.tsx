import {useState , useCallback , useRef} from 'react'
import {
  Upload
} from "lucide-react";
import {Inputfile} from "../index";

function DropZone() {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
      }, []);
    
      const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
      }, []);
    
      const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // Handle file drop logic here
      }, []);
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative bg-white rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
        isDragging
          ? "border-blue-500 bg-blue-50/50 shadow-xl shadow-blue-500/10"
          : "border-slate-200 hover:border-slate-300 shadow-sm"
      }`}
    >
      <div className="p-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 shadow-inner">
          <Upload className="w-10 h-10 text-blue-600" strokeWidth={2} />
        </div>
        <h3 className="text-2xl font-semibold text-slate-900 mb-3">
          Drag & Drop your video here
        </h3>
        <p className="text-slate-500 mb-8">or click to browse</p>

        <button
          onClick={() => inputRef.current!.click()}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
        >
          <Upload className="w-5 h-5" />
          <Inputfile
            type="file"
            id="fileUpload"
            name="fileUpload"
            ref={inputRef}
            accept="video/*"
            className="hidden"
          />
          Browse Files
        </button>

        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-2">
            Supports MP4, MOV, AVI, MKV, WebM
          </p>
          <p className="text-xs text-slate-400">Maximum file size: 5GB</p>
        </div>
      </div>
    </div>
  );
}

export default DropZone