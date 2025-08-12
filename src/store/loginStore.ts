import { create } from 'zustand';


interface LoginUIState {
  // 폼 입력값
  email: string;
  password: string;
  
  // 에러 상태
  error: string | null;
  
  // 로딩 상태
  isLoading: boolean;
}

interface LoginUIActions {
  // 입력값 설정
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  
  // 에러 설정
  setError: (error: string | null) => void;
  
  // 로딩 상태 설정
  setLoading: (loading: boolean) => void;
  
  // 전체 리셋
  resetForm: () => void;
}

const initialState: LoginUIState = {
  email: '',
  password: '',
  error: null,
  isLoading: false,
};

export const useLoginStore = create<LoginUIState & LoginUIActions>()(
  (set) => ({
      ...initialState,
      
      // 입력값 설정
      setEmail: (email) => {
        set({ email, error: null }); // 이메일 변경 시 에러 초기화
      },
      
      setPassword: (password) => {
        set({ password, error: null }); // 비밀번호 변경 시 에러 초기화
      },
      
      // 에러 설정
      setError: (error) => {
        set({ error });
      },
      
      // 로딩 상태 설정
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      // 전체 리셋
      resetForm: () => {
        set(initialState);
      },
    }));
