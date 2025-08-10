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
  // 선택된 사용자 ID들 (userId 기반)
  selectedUserIds: number[];
  selectedUser: PermissionUser | null;
  isModalOpen: boolean;
  
  // 액션들
  setSelectedUserIds: (userIds: number[] | ((prev: number[]) => number[])) => void;
  addSelectedUserId: (userId: number) => void;
  removeSelectedUserId: (userId: number) => void;
  toggleSelectedUserId: (userId: number) => void;
  clearSelectedUserIds: () => void;
  setSelectedUser: (user: PermissionUser | null) => void;
  setModalOpen: (open: boolean) => void;
  resetPermissionState: () => void;
}

export const usePermissionStore = create<PermissionState>()(
  (set, get) => ({
    // 초기 상태
    selectedUserIds: [],
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
      const { selectedUserIds } = get();
      if (!selectedUserIds.includes(userId)) {
        set({ selectedUserIds: [...selectedUserIds, userId] });
      }
    },
    
    removeSelectedUserId: (userId) => {
      const { selectedUserIds } = get();
      set({ selectedUserIds: selectedUserIds.filter(id => id !== userId) });
    },
    
    toggleSelectedUserId: (userId) => {
      const { selectedUserIds } = get();
      if (selectedUserIds.includes(userId)) {
        set({ selectedUserIds: selectedUserIds.filter(id => id !== userId) });
      } else {
        set({ selectedUserIds: [...selectedUserIds, userId] });
      }
    },
    
    clearSelectedUserIds: () => set({ selectedUserIds: [] }),
    
    setSelectedUser: (user) => set({ selectedUser: user }),
    
    setModalOpen: (open) => set({ isModalOpen: open }),
    
    resetPermissionState: () => {
      set({
        selectedUserIds: [],
        selectedUser: null,
        isModalOpen: false,
      });
    },
  })
);