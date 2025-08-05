import { create } from 'zustand';
import type { User } from '@/types/user';

// 임시 사용자 데이터 (API 연결 전까지 사용)
const initialUserData: User[] = [
  { id: 1, name: "이주원", department: "마케팅팀", role: "관리자", email: "lee@gachon.ac.kr" },
  { id: 2, name: "정지민", department: "개발팀", role: "편집자", email: "jmjung@gachon.ac.kr" },
  { id: 3, name: "김동섭", department: "디자인팀", role: "사용자", email: "dongsub@gachon.ac.kr" },
  { id: 4, name: "박서연", department: "기획팀", role: "관리자", email: "seoyeon@gachon.ac.kr" },
  { id: 5, name: "최민수", department: "개발팀", role: "편집자", email: "minsu@gachon.ac.kr" },
  { id: 6, name: "김영희", department: "디자인팀", role: "사용자", email: "younghee@gachon.ac.kr" },
  { id: 7, name: "이철수", department: "마케팅팀", role: "편집자", email: "chulsoo@gachon.ac.kr" },
  { id: 8, name: "정미영", department: "기획팀", role: "사용자", email: "miyoung@gachon.ac.kr" },
  { id: 9, name: "박준호", department: "개발팀", role: "관리자", email: "junho@gachon.ac.kr" },
  { id: 10, name: "김수진", department: "디자인팀", role: "편집자", email: "soojin@gachon.ac.kr" },
  { id: 11, name: "이민지", department: "마케팅팀", role: "사용자", email: "minji@gachon.ac.kr" },
  { id: 12, name: "최동욱", department: "기획팀", role: "관리자", email: "dongwook@gachon.ac.kr" }
];

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  searchTerm: string;
  selectedDepartment: string;
  
  // 액션들
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setSearchTerm: (term: string) => void;
  setSelectedDepartment: (department: string) => void;
  addUser: (user: User) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
  deleteUser: (id: number) => void;
  resetFilters: () => void;
  getFilteredData: (currentPage: number, itemsPerPage: number) => {
    paginatedData: User[];
    totalPages: number;
  };
}

export const useUserStore = create<UserState>()(
  (set, get) => ({
    // 초기 상태
    // TODO: API 연결 시 users: []로 변경하고 useEffect나 액션에서 데이터 로드
    users: initialUserData,
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 5,
    searchTerm: '',
    selectedDepartment: 'all',
    
    // 액션들
    setUsers: (users) => set({ users }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setTotalPages: (pages) => set({ totalPages: pages }),
    setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
    setSelectedDepartment: (department) => set({ selectedDepartment: department, currentPage: 1 }),
    
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
        selectedDepartment: 'all',
        currentPage: 1
      });
    },

    getFilteredData: (currentPage, itemsPerPage) => {
      const { users, searchTerm, selectedDepartment } = get();
      
      // 필터링
      let filteredUsers = users;
      
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedDepartment !== 'all') {
        filteredUsers = filteredUsers.filter(user =>
          user.department === selectedDepartment
        );
      }
      
      // 페이지네이션
      const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredUsers.slice(startIndex, endIndex);
      
      return {
        paginatedData,
        totalPages
      };
    }
  })
); 