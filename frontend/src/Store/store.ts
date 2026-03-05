import { create } from "zustand";

interface DashboardSectionState {
  id: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setid: (newId: string) => void;
}
const dashboardSection = create<DashboardSectionState>((set) => ({
  id: "dashboard",
  activeTab: "dashboard",
  setid: (newId) => set({ id: newId }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

interface VideoUploadingState {
  isUploading: boolean;
  setIsUploading: () => void;
}

const videoUploding = create<VideoUploadingState>((set) => ({
  isUploading: false,
  setIsUploading: () =>
    set((state: VideoUploadingState) => ({ isUploading: !state.isUploading })),
}));

interface VideoItem {
  id: string; // socketVideoId / index
  fileName: string;
  progress: number;
  status: string;
}
interface uploadVideoProcessingState {
  videos: VideoItem[];
  nextVideoId: number;

  addVideo: (video: VideoItem) => void;
  updateVideo: (id: string, data: Partial<VideoItem>) => void;

  removeVideo: (id: string) => void;
  clearVideos: () => void;
  getNextVideoId: () => number;
  resetVideoIdCounter: () => void;
}


const uploadVideoProcessing = create<uploadVideoProcessingState>((set, get) => ({
  videos: [],
  nextVideoId: 0,

  addVideo: (video) =>
    set((state) => ({
      videos: [...state.videos, video],
      nextVideoId: state.nextVideoId + 1,
    })),

  updateVideo: (id, data) =>
    set((state) => ({
      videos: state.videos.map((v) => (v.id === id ? { ...v, ...data } : v)),
    })),

  removeVideo: (id) =>
    set((state) => ({
      videos: state.videos.filter((v) => v.id !== id),
    })),

  clearVideos: () => set({ videos: [], nextVideoId: 0 }),

  getNextVideoId: () => get().nextVideoId,

  resetVideoIdCounter: () => set({ nextVideoId: 0 }),
}));

interface dashBoardStatsState {
  totalVideos: number,
  setTotalVideos: (newTotalVideos: number) => void,
  videosInQueue: number,
  setVideosInQueue: (newVideosInQueue: number) => void,
  completedToday: number,
  setCompletedToday: (newCompletedToday: number) => void,
  UsedStorage: number,
  setUsedStorage: (newUsedStorage: number) => void
}
const dashBoardStats = create<dashBoardStatsState>((set) => ({
  totalVideos: 0,
  setTotalVideos: (newTotalVideos) => set({ totalVideos: newTotalVideos }),
  videosInQueue: 0,
  setVideosInQueue: (newVideosInQueue) =>
    set({ videosInQueue: newVideosInQueue }),
  completedToday: 0,
  setCompletedToday: (newCompletedToday) =>
    set({ completedToday: newCompletedToday }),
  UsedStorage: 0,
  setUsedStorage: (newUsedStorage) => set({ UsedStorage: newUsedStorage }),
}));
export default dashboardSection;
export { videoUploding, uploadVideoProcessing, dashBoardStats };
