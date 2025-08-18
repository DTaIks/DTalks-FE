import { create } from 'zustand';

type TabType = 'compare' | 'history';

interface CompareState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  resetAll: () => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  activeTab: 'compare',
  setActiveTab: (tab) => set({ activeTab: tab }),
  resetAll: () => set({ activeTab: 'compare' }),
}));
