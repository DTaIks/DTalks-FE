import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  employeeNumber: string;
  department?: string;
  position?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

interface DashboardState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  searchTerm: string;
  selectedStatus: string;
  
  // 액션들
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setSearchTerm: (term: string) => void;
  setSelectedStatus: (status: string) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  resetFilters: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  (set, get) => ({
    // 초기 상태
    users: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    searchTerm: '',
    selectedStatus: 'all',
    
    // 액션들
    setUsers: (users) => set({ users }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setTotalPages: (pages) => set({ totalPages: pages }),
    setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
    setSelectedStatus: (status) => set({ selectedStatus: status, currentPage: 1 }),
    
    addUser: (user) => {
      const { users } = get();
      set({ users: [...users, user] });
    },
    
    updateUser: (id, updates) => {
      const { users } = get();
      set({
        users: users.map(user => 
          user.id === id ? { ...user, ...updates } : user
        )
      });
    },
    
    deleteUser: (id) => {
      const { users } = get();
      set({
        users: users.filter(user => user.id !== id)
      });
    },
    
    resetFilters: () => {
      set({
        searchTerm: '',
        selectedStatus: 'all',
        currentPage: 1
      });
    }
  })
); 