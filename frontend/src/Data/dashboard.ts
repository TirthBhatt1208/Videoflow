import {
  Video,
  Upload,
  Film,
  BarChart3,
  Settings,
  User,
  CheckCircle,
  Database,
  Clock,
} from "lucide-react";
import type {VideoItem , ProcessingJob} from "../Types/dashboard.ts"

export const stats = [
    {
      icon: Video,
      label: "Total Videos",
      value: "247",
      badge: "+12%",
      badgeColor: "bg-green-100 text-green-700",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Clock,
      label: "Processing",
      value: "5",
      badge: "3 in queue",
      badgeColor: "bg-yellow-100 text-yellow-700",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: CheckCircle,
      label: "Completed Today",
      value: "18",
      badge: "100% Success",
      badgeColor: "bg-green-100 text-green-700",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Database,
      label: "Of 10GB",
      value: "7.2GB",
      badge: "72% Used",
      badgeColor: "bg-purple-100 text-purple-700",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

export const recentVideos: VideoItem[] = [
    {
      id: "1",
      name: "Marketing_V2_Final.mp4",
      size: "128MB",
      format: "MP4",
      duration: "02:14",
      status: "processing",
      uploadedAt: "2 mins ago",
      thumbnail: "bg-gradient-to-br from-orange-400 to-orange-600",
    },
    {
      id: "2",
      name: "Product_Demo_Q4.mov",
      size: "450MB",
      format: "MOV",
      duration: "05:32",
      status: "completed",
      uploadedAt: "1 hour ago",
      thumbnail: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    },
    {
      id: "3",
      name: "Social_Reel_Draft.mp4",
      size: "45MB",
      format: "MP4",
      duration: "--:--",
      status: "failed",
      uploadedAt: "3 hours ago",
      thumbnail: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
    {
      id: "4",
      name: "Interview_Part1.mp4",
      size: "1.2GB",
      format: "MP4",
      duration: "14:20",
      status: "completed",
      uploadedAt: "Yesterday",
      thumbnail: "bg-gradient-to-br from-green-500 to-green-700",
    },
    {
      id: "5",
      name: "Tutorial_Intro.mov",
      size: "89MB",
      format: "MOV",
      duration: "01:45",
      status: "completed",
      uploadedAt: "Yesterday",
      thumbnail: "bg-gradient-to-br from-amber-500 to-amber-700",
    },
  ];

export const processingJobs: ProcessingJob[] = [
    {
      id: "1",
      name: "Marketing_V2.mp4",
      progress: 65,
      timeRemaining: "2m remaining",
      status: "rendering",
    },
    {
      id: "2",
      name: "Web_Asset_01.gif",
      progress: 30,
      timeRemaining: "5m remaining",
      status: "compressing",
    },
    {
      id: "3",
      name: "Archive_2022.zip",
      progress: 0,
      timeRemaining: "Waiting...",
      status: "queued",
    },
  ];

export const getStatusBadge = (status: string) => {
    const styles = {
      processing: "bg-yellow-100 text-yellow-700 border-yellow-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      failed: "bg-red-100 text-red-700 border-red-200",
    };
    return styles[status as keyof typeof styles] || "";
  };

export const menuItems = [
  { id: "dashboard", icon: BarChart3, label: "Dashboard" },
  { id: "upload", icon: Upload, label: "Upload" },
  { id: "videos", icon: Film, label: "My Videos" },
  { id: "videoUploading", icon: BarChart3, label: "Video Uploading" },
  { id: "settings", icon: Settings, label: "Settings" },
  { id: "profile", icon: User, label: "Profile" },
];

export const uploadFile = [
      {
        id: "1",
        name: "Nature_Documentary_v2.mp4",
        size: 2.4,
        duration: "05:32",
        thumbnail:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
        status: "uploading",
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
        status: "complete",
      },
      {
        id: "3",
        name: "Unsupported_File.exe",
        size: 0.5,
        duration: "",
        thumbnail: "",
        status: "failed",
        errorMessage: "Unsupported format",
      },
]