import { create } from 'zustand';

interface PermissionUser {
  roleId: number;
  image: string;
  roleName: string;
  roleNameEn: string;
  description: string;
  roleUserCount: number;
  isActive: string;
}

interface PermissionState {
  selectedUserIds: number[];
  excludedUserIds: number[];
  selectedUser: PermissionUser | null;
  isModalOpen: boolean;
  
  // 액션들
  setSelectedUserIds: (userIds: number[] | ((prev: number[]) => number[])) => void;
  addSelectedUserId: (userId: number) => void;
  removeSelectedUserId: (userId: number) => void;
  toggleSelectedUserId: (userId: number) => void;
  clearSelectedUserIds: () => void;
  
  // 제외 관련 액션들
  addExcludedUserId: (userId: number) => void;
  removeExcludedUserId: (userId: number) => void;
  clearExcludedUserIds: () => void;
  isUserExcluded: (userId: number) => boolean;
  
  setSelectedUser: (user: PermissionUser | null) => void;
  setModalOpen: (open: boolean) => void;
  resetPermissionState: () => void;
}

export const usePermissionStore = create<PermissionState>()(
  (set, get) => ({
    selectedUserIds: [],
    excludedUserIds: [],
    selectedUser: null,
    isModalOpen: false,
    
    // 액션들
    setSelectedUserIds: (userIds) => {
      if (typeof userIds === 'function') {
        set((state) => ({ selectedUserIds: userIds(state.selectedUserIds) }));
      } else {
        set({ selectedUserIds: userIds });
      }
    },
    
    addSelectedUserId: (userId) => {
      const { selectedUserIds, excludedUserIds } = get();
      if (!selectedUserIds.includes(userId)) {
        set({ 
          selectedUserIds: [...selectedUserIds, userId],
          // 선택하면 제외 목록에서 제거
          excludedUserIds: excludedUserIds.filter(id => id !== userId)
        });
      }
    },
    
    removeSelectedUserId: (userId) => {
      const { selectedUserIds, excludedUserIds } = get();
      set({ 
        selectedUserIds: selectedUserIds.filter(id => id !== userId),
        // 제거하면 제외 목록에 추가
        excludedUserIds: excludedUserIds.includes(userId) ? excludedUserIds : [...excludedUserIds, userId]
      });
    },
    
    toggleSelectedUserId: (userId) => {
      const { selectedUserIds, excludedUserIds } = get();
      if (selectedUserIds.includes(userId)) {
        set({ 
          selectedUserIds: selectedUserIds.filter(id => id !== userId),
          excludedUserIds: excludedUserIds.includes(userId) ? excludedUserIds : [...excludedUserIds, userId]
        });
      } else {
        set({ 
          selectedUserIds: [...selectedUserIds, userId],
          excludedUserIds: excludedUserIds.filter(id => id !== userId)
        });
      }
    },
    
    clearSelectedUserIds: () => set({ selectedUserIds: [] }),
    
    // 제외 관련 액션들
    addExcludedUserId: (userId) => {
      const { excludedUserIds } = get();
      if (!excludedUserIds.includes(userId)) {
        set({ excludedUserIds: [...excludedUserIds, userId] });
      }
    },
    
    removeExcludedUserId: (userId) => {
      const { excludedUserIds } = get();
      set({ excludedUserIds: excludedUserIds.filter(id => id !== userId) });
    },
    
    clearExcludedUserIds: () => set({ excludedUserIds: [] }),
    
    isUserExcluded: (userId) => {
      const { excludedUserIds } = get();
      return excludedUserIds.includes(userId);
    },
    
    setSelectedUser: (user) => set({ selectedUser: user }),
    
    setModalOpen: (open) => set({ isModalOpen: open }),
    
    resetPermissionState: () => {
      set({
        selectedUserIds: [],
        excludedUserIds: [],
        selectedUser: null,
        isModalOpen: false,
      });
    },
  })
);
