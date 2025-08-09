import { create } from 'zustand';

type TabType = 'compare' | 'history';

interface CompareState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  activeTab: 'compare',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
