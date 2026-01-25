import React, { useState, useCallback, useRef } from "react";
import { Upload, VideoOff } from "lucide-react";
import Inputfile from "../dashboard/Inputfile";

interface VideoFile {
  id: string;
  name: string;
  size: number;
  url: string;
}

const NoVideoUploading: React.FC = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFiles = (files: File[]) => {
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));

    const newVideos: VideoFile[] = videoFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setVideos((prev) => [...prev, ...newVideos]);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };


  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Empty State */}
          <div className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-64 h-64 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                <VideoOff
                  className="w-24 h-24 text-gray-300"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Text */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No videos are uploading currently
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Start a new project by dragging a file here or clicking the button
              below.
            </p>

            {/* Upload Button */}
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 mb-4"
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
              Upload New Video
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          {/* Footer Links */}
          <div className="flex justify-center gap-8 mb-4 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Help Center
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              API Documentation
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500">
            © 2023 VideoProcess AI Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-10 border-4 border-blue-600 border-dashed flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-900">
              Drop your videos here
            </p>
          </div>
        </div>
      )}

      {/* Video List (if any uploaded) */}
      {videos.length > 0 && (
        <div className="fixed bottom-24 right-8 bg-white rounded-lg shadow-xl p-4 max-w-sm">
          <h3 className="font-semibold mb-2">
            Uploaded Videos ({videos.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <div className="flex-1 truncate text-sm">{video.name}</div>
                <div className="text-xs text-gray-500">
                  {(video.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoVideoUploading;
