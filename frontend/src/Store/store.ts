import { create } from 'zustand'

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
    setIsUploading: () => set((state: VideoUploadingState) => ({ isUploading: !state.isUploading })),
}));

export default dashboardSection;
export { videoUploding };