export const UploadVideo = [
  {
    id: "1",
    name: "Nature_Documentary_v2.mp4",
    size: 2.4,
    duration: "05:32",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
    status: "uploading" as const,
    progress: 45,
    uploadSpeed: "15 MB/s",
    timeLeft: "2 mins left",
  },
  {
    id: "2",
    name: "City_Timelapse_4K.mov",
    size: 3.2,
    duration: "03:45",
    thumbnail:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop",
    status: "complete" as const,
  },
  {
    id: "3",
    name: "Unsupported_File.exe",
    size: 0.5,
    duration: "",
    thumbnail: "",
    status: "failed" as const,
    errorMessage: "Unsupported format",
  },
];