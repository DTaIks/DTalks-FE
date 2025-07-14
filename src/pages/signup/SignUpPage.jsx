import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import InputField from '../../components/signup/InputField';
import ActionButton from '../../components/signup/ActionButton';
import Logo from '../../assets/common/Logo.png';

// 추후에 백엔드 측에서 설정한 시간으로 변경
const AUTH_TIMEOUT = 180;

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    authCode: '',
    employeeNumber: '',
    password: '',
    passwordCheck: ''
  });

  const [formState, setFormState] = useState({
    isEmailVerified: false,
    isAuthCodeSent: false,
    isAuthCodeVerified: false,
    messages: {},
    touched: {},
    authTimer: 0,
    canResend: false
  });

  useEffect(() => {
    let interval = null;
    if (formState.authTimer > 0) {
      interval = setInterval(() => {
        setFormState(prev => {
          const newTimer = prev.authTimer - 1;
          if (newTimer === 0) {
            return { ...prev, authTimer: 0, canResend: true };
          }
          return { ...prev, authTimer: newTimer };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [formState.authTimer]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // 유효성 검사 함수들
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return '이메일을 입력해 주세요.';
    if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다.';
    return '';
  };

  const validateEmployeeNumber = (num) => {
    if (!num) return '사원번호를 입력해 주세요.';
    if (num.length < 4) return '유효하지 않은 사원번호입니다.';
    return '';
  };

  const validatePassword = (pw) => {
    if (!pw) return '비밀번호를 입력해 주세요.';
    if (pw.length < 8 || pw.length > 20) return '비밀번호는 8~20자여야 합니다.';
    if (!/[a-zA-Z]/.test(pw) || !/\d/.test(pw) || !/[!@#$%^&*(),.?":{}|<>]/.test(pw))
      return '비밀번호는 문자, 숫자, 특수문자를 포함해야 합니다.';
    return '';
  };

  const validatePasswordCheck = (pw, check) => {
    if (!check) return '비밀번호를 다시 입력해 주세요.';
    if (pw !== check) return '비밀번호가 일치하지 않습니다.';
    return '';
  };

  const validateAuthCode = (code) => {
    if (!code) return '인증번호를 입력해 주세요.';
    if (code.length !== 6) return '인증번호 6자리를 입력하세요.';
    return '';
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'email': return validateEmail(value);
      case 'employeeNumber': return validateEmployeeNumber(value);
      case 'password': return validatePassword(value);
      case 'passwordCheck': return validatePasswordCheck(formData.password, value);
      case 'authCode': return validateAuthCode(value);
      default: return '';
    }
  };

  // 성공, 에러, 정보 메시지 표시
  const updateMessage = (field, text, type) => {
    setFormState(prev => ({
      ...prev,
      messages: { ...prev.messages, [field]: { text, type } }
    }));
  };

  // 유효성 검사 통과시 에러 메시지 제거
  const clearMessage = (field) => {
    setFormState(prev => ({
      ...prev,
      messages: { ...prev.messages, [field]: undefined }
    }));
  };

  // 입력 필드가 모두 채워졌는지, 인증이 완료되었는지 확인하는 함수
  const isSubmitEnabled = () => {
    const hasAllFields = Object.values(formData).every(v => v.trim() !== '');
    const hasVerifications = formState.isEmailVerified && formState.isAuthCodeVerified;
    const hasErrors = Object.values(formState.messages).some(msg => msg?.type === 'error');
    
    return hasAllFields && hasVerifications && !hasErrors;
  };

  // 이벤트 핸들러들
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (formState.touched[field]) {
      const error = validateField(field, value);
      if (error) {
        updateMessage(field, error, 'error');
      } else {
        clearMessage(field);
      }
    }
  };

  const handleInputBlur = (field) => () => {
    const error = validateField(field, formData[field]);
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: true }
    }));
    
    if (error) {
      updateMessage(field, error, 'error');
    } else {
      clearMessage(field);
    }
  };

  const handleEmailCheck = () => {
    const error = validateEmail(formData.email);
    if (error) {
      updateMessage('email', error, 'error');
      setFormState(prev => ({
        ...prev,
        touched: { ...prev.touched, email: true }
      }));
      return;
    }

    updateMessage('email', '사용 가능한 이메일입니다.', 'success');
    setFormState(prev => ({
      ...prev,
      isEmailVerified: true
    }));
  };

  const handleAuthCodeSend = () => {
    updateMessage('authCode', '입력하신 이메일로 인증번호를 보냈습니다.', 'info');
    setFormState(prev => ({
      ...prev,
      isAuthCodeSent: true,
      authTimer: AUTH_TIMEOUT,
      canResend: false
    }));
  };

  const handleAuthCodeVerify = () => {
    const error = validateAuthCode(formData.authCode);
    if (error) {
      updateMessage('authCode', error, 'error');
      setFormState(prev => ({
        ...prev,
        touched: { ...prev.touched, authCode: true }
      }));
      return;
    }

    updateMessage('authCode', '인증번호가 확인되었습니다.', 'success');
    setFormState(prev => ({
      ...prev,
      isAuthCodeVerified: true,
      authTimer: 0
    }));
  };

  const handleAuthCodeResend = () => {
    updateMessage('authCode', '인증번호가 재전송되었습니다.', 'info');
    setFormState(prev => ({
      ...prev,
      authTimer: AUTH_TIMEOUT,
      canResend: false
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, error]) => {
        updateMessage(field, error, 'error');
      });
      
      setFormState(prev => ({
        ...prev,
        touched: Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      }));
      return;
    }

    // 회원가입 로직 실행
    console.log('회원가입 데이터:', formData);
  };

  // 메시지 표시 관련 함수들
  const getMessage = (field) => {
    return formState.messages[field]?.text || '';
  };

  const getMessageColor = (field) => {
    const type = formState.messages[field]?.type;
    if (type === 'error') return '#F0191D';
    if (type === 'info') return '#9966CC';
    return '#22C55E';
  };

  const getAuthButtonText = () => {
    if (!formState.isAuthCodeSent) return '인증번호 받기';
    if (formState.isAuthCodeVerified) return '인증완료';
    if (formState.authTimer > 0) return '인증번호 확인';
    return '재전송';
  };

  const getAuthButtonClick = () => {
    if (!formState.isAuthCodeSent) return handleAuthCodeSend;
    if (formState.authTimer > 0 && !formState.isAuthCodeVerified) return handleAuthCodeVerify;
    return handleAuthCodeResend;
  };

  const isAuthButtonDisabled = () => {
    if (!formState.isEmailVerified) return true;
    if (formState.isAuthCodeVerified) return true;
    if (formState.isAuthCodeSent && formState.authTimer > 0 && !formData.authCode && !formState.isAuthCodeVerified) return true;
    return false;
  };

  return (
    <PageWrapper>
      <LogoImage src={Logo} alt="Logo" />
      <FormWrapper>
        <Title>지금 함께 시작해볼까요?</Title>
        <form onSubmit={handleSubmit} noValidate>
          <InputField
            label="이메일"
            placeholder="이메일을 입력해 주세요."
            inputProps={{
              type: 'email',
              value: formData.email,
              onChange: handleInputChange('email'),
              onBlur: handleInputBlur('email'),
              required: true
            }}
            infoText={getMessage('email')}
            infoTextColor={getMessageColor('email')}
            buttonText="중복 확인"
            onButtonClick={handleEmailCheck}
            buttonDisabled={!formData.email || formState.isEmailVerified}
          />

          <AuthCodeFieldWrapper>
            <InputField
              label="인증번호 입력"
              placeholder="인증번호를 입력해 주세요."
              inputProps={{
                value: formData.authCode,
                onChange: handleInputChange('authCode'),
                onBlur: handleInputBlur('authCode'),
                required: true,
                disabled: !formState.isEmailVerified || formState.isAuthCodeVerified
              }}
              infoText={getMessage('authCode')}
              infoTextColor={getMessageColor('authCode')}
              buttonText={getAuthButtonText()}
              onButtonClick={getAuthButtonClick()}
              buttonDisabled={isAuthButtonDisabled()}
            />

            {formState.authTimer > 0 && !formState.isAuthCodeVerified && (
              <TimerText>남은 시간: {formatTimer(formState.authTimer)}</TimerText>
            )}

            {formState.isAuthCodeSent && formState.authTimer === 0 && !formState.isAuthCodeVerified && (
              <TimerText>인증시간이 만료되었습니다. 재전송 버튼을 눌러주세요.</TimerText>
            )}
          </AuthCodeFieldWrapper>

          <InputField
            label="사원번호"
            placeholder="사원번호를 입력해 주세요."
            inputProps={{
              value: formData.employeeNumber,
              onChange: handleInputChange('employeeNumber'),
              onBlur: handleInputBlur('employeeNumber'),
              required: true
            }}
            infoText={getMessage('employeeNumber')}
            infoTextColor={getMessageColor('employeeNumber')}
          />

          <InputField
            label="비밀번호"
            placeholder="문자, 숫자, 특수문자 포함 8자~20자"
            inputProps={{
              type: 'password',
              value: formData.password,
              onChange: handleInputChange('password'),
              onBlur: handleInputBlur('password'),
              required: true
            }}
            infoText={getMessage('password')}
            infoTextColor={getMessageColor('password')}
          />

          <InputField
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해 주세요."
            inputProps={{
              type: 'password',
              value: formData.passwordCheck,
              onChange: handleInputChange('passwordCheck'),
              onBlur: handleInputBlur('passwordCheck'),
              required: true
            }}
            infoText={getMessage('passwordCheck')}
            infoTextColor={getMessageColor('passwordCheck')}
          />

          <ActionButton
            type="submit"
            variant="submit"
            text="회원가입"
            disabled={!isSubmitEnabled()}
            fontSize="16px"
            style={{ marginTop: '60px' }}
          />
        </form>
      </FormWrapper>

      <BottomText>
        이미 계정이 있으신가요?{' '}
        <BottomLink href="/login">로그인하기</BottomLink>
      </BottomText>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  background: #F8F2FB;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 20px;
  font-family: 'Pretendard';
`;

const LogoImage = styled.img`
  width: 135.348px;
  height: 134px;
  margin-bottom: 65px;
  margin-top: 152px;
  flex-shrink: 0;
  aspect-ratio: 135.35/134.00;
`;

const FormWrapper = styled.div`
  background: #FFF;
  border-radius: 16px;
  width: 770px;
  height: 960px;
  flex-shrink: 0;
  border-radius: 25px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  color: #000;
  text-align: center;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 87.5% */
  margin-top: 68px;
  margin-bottom: 73px;
`;

const BottomText = styled.p`
  color: #000;
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  margin-top: 27px;
`;

const BottomLink = styled.a`
  color: #96C;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  cursor: pointer;
`;

const TimerText = styled.div`
  font-size: 12px;
  color: #F0191D;
  text-align: center;
  margin-top: 4px;
  font-weight: 500;
`;

const AuthCodeFieldWrapper = styled.div`
  position: relative;
`;
