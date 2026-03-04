export type VideoStatusType =
  | "UPLOADED"
  | "QUEUED"
  | "METADATA_EXTRACTED"
  | "VTT_GENERATED"
  | "TRANSCODED"
  | "VTTGENERATED"
  | "HLS_READY"
  | "COMPLETED"
  | "FAILED";

export interface VideoItem {
  id: string;
  name: string;
  size: string;
  format: string;
  duration: string;
  status: VideoStatusType;
  progress: number;
  uploadedAt: string;
  createdAt: string;
}

export interface ProcessingJob {
  id: string;
  fileName: string;
  progress: number;
  status: VideoStatusType;
  createdAt: string;
}

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}