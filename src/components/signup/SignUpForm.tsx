import styled from 'styled-components';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';
import { useSignUpForm } from '@/hooks/useSignUp';

export default function SignUpForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    errors,
    authState,
    handleEmailCheck,
    getAuthButtonText,
    getAuthButtonClick,
    isAuthButtonDisabled,
    isSubmitEnabled,
    formatTimer,
    getEmailCheckButtonText,
    isEmailCheckButtonDisabled,
    getSubmitButtonText
  } = useSignUpForm();

  return (
    <FormWrapper>
      <Title>지금 함께 시작해볼까요?</Title>
      <form onSubmit={handleSubmit} noValidate>
        <InputField
          variant="signup"
          label="이메일"
          placeholder="이메일을 입력해 주세요."
          inputProps={{
            type: 'email',
            ...register('email'),
            disabled: authState.isEmailVerified
          }}
          infoText={errors.email?.message || (authState.isEmailVerified ? '사용 가능한 이메일입니다.' : '')}
          infoTextColor={errors.email ? '#F0191D' : authState.isEmailVerified ? '#27ae60' : ''}
          buttonText={getEmailCheckButtonText()}
          onButtonClick={handleEmailCheck}
          buttonDisabled={isEmailCheckButtonDisabled()}
        />

        <AuthCodeFieldWrapper>
          <InputField
            variant="signup"
            label="인증번호 입력"
            placeholder="인증번호를 입력해 주세요."
            inputProps={{
              ...register('authCode'),
              required: true,
              disabled: !authState.isEmailVerified || authState.isAuthCodeVerified
            }}
            infoText={errors.authCode?.message || ''}
            infoTextColor={errors.authCode ? '#F0191D' : ''}
            buttonText={getAuthButtonText()}
            onButtonClick={getAuthButtonClick()}
            buttonDisabled={isAuthButtonDisabled()}
          />

          {authState.authTimer > 0 && !authState.isAuthCodeVerified && (
            <TimerText>남은 시간: {formatTimer(authState.authTimer)}</TimerText>
          )}

          {authState.isAuthCodeSent && authState.authTimer === 0 && !authState.isAuthCodeVerified && (
            <TimerText>인증시간이 만료되었습니다.</TimerText>
          )}
        </AuthCodeFieldWrapper>

        <InputField
          variant="signup"
          label="사원번호"
          placeholder="사원번호를 입력해 주세요."
          inputProps={{
            ...register('employeeNumber')
          }}
          infoText={errors.employeeNumber?.message || ''}
          infoTextColor={errors.employeeNumber ? '#F0191D' : ''}
        />

        <InputField
          variant="signup"
          label="비밀번호"
          placeholder="문자, 숫자, 특수문자 포함 8자~20자"
          inputProps={{
            type: 'password',
            ...register('password')
          }}
          infoText={errors.password?.message || ''}
          infoTextColor={errors.password ? '#F0191D' : ''}
        />

        <InputField
          variant="signup"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해 주세요."
          inputProps={{
            type: 'password',
            ...register('passwordCheck')
          }}
          infoText={errors.passwordCheck?.message || ''}
          infoTextColor={errors.passwordCheck ? '#F0191D' : ''}
        />

        <Button
          text={getSubmitButtonText()}
          type="submit"
          variant="submit"
          width="380px"
          disabled={!isSubmitEnabled()}
          fontSize="16px"
          style={{ marginTop: '60px' }}
        />
      </form>
    </FormWrapper>
  );
}

const FormWrapper = styled.div`
  background: #FFF;
  border-radius: 16px;
  width: 585px;
  flex-shrink: 0;
  border-radius: 25px;
  padding-bottom: 44px;
`;

const Title = styled.h2`
  color: #000;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 21px;
  margin-top: 51px;
  margin-bottom: 54.75px;
`;

const TimerText = styled.div`
  font-size: 12px;
  color: #F0191D;
  text-align: center;
  margin-top: 3px;
  font-weight: 500;
`;

const AuthCodeFieldWrapper = styled.div`
  position: relative;
`;
