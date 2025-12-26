import { create } from 'zustand'

interface DashboardSectionState {
    id: string;
    setid: (newId: string) => void;
}
const dashboardSection = create<DashboardSectionState>((set) => ({
    id: "",
    setid: (newId) => set({id: newId}),
}));
export default dashboardSection;