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

interface uploadVideoProcessingState {
  fileName: string;
  setFileName: (newFileName: string) => void;
  progress: number,
  setProgress: (newProgress: number) => void,
  status: string;
  setStatus: (newStatus: string) => void;
}

const uploadVideoProcessing = create<uploadVideoProcessingState>((set) => ({
  fileName: "",
  setFileName: (newFileName) => set({ fileName: newFileName }),
  progress: 0,
  setProgress: (newProgress: number) => set({progress: newProgress}),
  status: "processing",
  setStatus: (newStatus) => set({ status: newStatus }),
}));

export default dashboardSection;
export { videoUploding, uploadVideoProcessing };
