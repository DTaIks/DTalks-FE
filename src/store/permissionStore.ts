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
  // 선택된 행들 (여러 개 선택 가능)
  selectedRows: number[];
  selectedUser: PermissionUser | null;
  isModalOpen: boolean;
  
  // 액션들
  setSelectedRows: (rows: number[]) => void;
  addSelectedRow: (rowIndex: number) => void;
  removeSelectedRow: (rowIndex: number) => void;
  toggleSelectedRow: (rowIndex: number) => void;
  clearSelectedRows: () => void;
  setSelectedUser: (user: PermissionUser | null) => void;
  setModalOpen: (open: boolean) => void;
  resetPermissionState: () => void;
}

export const usePermissionStore = create<PermissionState>()(
  (set, get) => ({
    // 초기 상태
    selectedRows: [],
    selectedUser: null,
    isModalOpen: false,
    
    // 액션들
    setSelectedRows: (rows) => set({ selectedRows: rows }),
    
    addSelectedRow: (rowIndex) => {
      const { selectedRows } = get();
      if (!selectedRows.includes(rowIndex)) {
        set({ selectedRows: [...selectedRows, rowIndex] });
      }
    },
    
    removeSelectedRow: (rowIndex) => {
      const { selectedRows } = get();
      set({ selectedRows: selectedRows.filter(row => row !== rowIndex) });
    },
    
    toggleSelectedRow: (rowIndex) => {
      const { selectedRows } = get();
      if (selectedRows.includes(rowIndex)) {
        set({ selectedRows: selectedRows.filter(row => row !== rowIndex) });
      } else {
        set({ selectedRows: [...selectedRows, rowIndex] });
      }
    },
    
    clearSelectedRows: () => set({ selectedRows: [] }),
    
    setSelectedUser: (user) => set({ selectedUser: user }),
    
    setModalOpen: (open) => set({ isModalOpen: open }),
    
    resetPermissionState: () => {
      set({
        selectedRows: [],
        selectedUser: null,
        isModalOpen: false,
      });
    },
  })
); 