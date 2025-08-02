import { useMutation, useQuery } from '@tanstack/react-query';
import { authAPI } from '../api/authAPI';
import { useAuthStore } from '../store/authStore';

// 더미 사용자 데이터
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: '123456',
    name: '테스트 사용자',
    employeeNumber: 'EMP001'
  },
  {
    id: '2', 
    email: 'admin@dtalks.com',
    password: 'admin123',
    name: '관리자',
    employeeNumber: 'EMP002'
  },
  {
    id: '3',
    email: 'user@dtalks.com', 
    password: 'user123',
    name: '일반 사용자',
    employeeNumber: 'EMP003'
  }
];

// 임시 API 함수들 (실제 API가 없을 때 사용)
const mockAPI = {
  login: async (data: { email: string; password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연
    
    // 더미 데이터에서 사용자 찾기
    const user = mockUsers.find(u => 
      u.email === data.email && u.password === data.password
    );
    
    if (!user) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    
    return {
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        employeeNumber: user.employeeNumber
      },
      token: 'mock-token-' + user.id
    };
  },
  
  signup: async (data: { email: string; password: string; employeeNumber: string; authCode: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: { id: '1', email: data.email, employeeNumber: data.employeeNumber },
      token: 'mock-token'
    };
  },
  
  checkEmailDuplicate: async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { isDuplicate: false };
  },
  
  sendAuthCode: async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: '인증번호가 발송되었습니다.' };
  },
  
  verifyAuthCode: async (email: string, code: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { isValid: code === '123456' }; // 임시로 123456이 유효한 코드
  }
};

// 이메일 중복 확인
export const useCheckEmailDuplicate = (email: string) => {
  return useQuery({
    queryKey: ['email-duplicate', email],
    queryFn: () => mockAPI.checkEmailDuplicate(email), // 임시 API 사용
    enabled: !!email && email.includes('@'),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 인증번호 발송
export const useSendAuthCode = () => {
  return useMutation({
    mutationFn: (email: string) => mockAPI.sendAuthCode(email), // 임시 API 사용
    onSuccess: () => {
      console.log('인증번호가 발송되었습니다.');
    },
    onError: (error) => {
      console.error('인증번호 발송 실패:', error);
    },
  });
};

// 인증번호 확인
export const useVerifyAuthCode = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      mockAPI.verifyAuthCode(email, code), // 임시 API 사용
    onSuccess: () => {
      console.log('인증번호가 확인되었습니다.');
    },
    onError: (error) => {
      console.error('인증번호 확인 실패:', error);
    },
  });
};

// 로그인
export const useLogin = () => {
  const { setUser, setAuthenticated, setLoading, setError } = useAuthStore();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      mockAPI.login({ email, password }), // 임시 API 사용
    onMutate: () => {
      // mutation 시작 시 로딩 상태 설정
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      // 성공 시 Zustand store 업데이트
      setUser(data.user);
      setAuthenticated(true);
      setLoading(false);
      setError(null);
    },
    onError: (error) => {
      // 실패 시 에러 상태 설정
      setLoading(false);
      setError(error instanceof Error ? error.message : '로그인에 실패했습니다.');
      console.error('로그인 실패:', error);
    },
  });
};

// 회원가입
export const useSignup = () => {
  const { setUser, setAuthenticated, setLoading, setError } = useAuthStore();
  
  return useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      employeeNumber: string;
      authCode: string;
    }) => mockAPI.signup(userData), // 임시 API 사용
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      // 성공 시 Zustand store 업데이트
      setUser(data.user);
      setAuthenticated(true);
      setLoading(false);
      setError(null);
    },
    onError: (error) => {
      setLoading(false);
      setError(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
      console.error('회원가입 실패:', error);
    },
  });
};

// 로그아웃
export const useLogout = () => {
  const { logout } = useAuthStore();
  
  return useMutation({
    mutationFn: () => Promise.resolve(), // 임시로 빈 함수
    onSuccess: () => {
      // Zustand store 초기화
      logout();
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error);
      // 에러가 있어도 로컬 상태는 초기화
      logout();
    },
  });
}; 