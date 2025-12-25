export interface VideoItem {
  id: string;
  name: string;
  size: string;
  format: string;
  duration: string;
  status: "processing" | "completed" | "failed";
  uploadedAt: string;
  thumbnail: string;
}

export interface ProcessingJob {
  id: string;
  name: string;
  progress: number;
  timeRemaining: string;
  status: "rendering" | "compressing" | "queued";
}

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}