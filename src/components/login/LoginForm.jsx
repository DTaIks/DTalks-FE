import styled from "styled-components";
import InputField from "./InputField";
import EmailInputField from "./EmailInputField";
import PropTypes from "prop-types";

const FrameChild = styled.div`
  width: 780px;
  height: 510px;
  position: relative;
  border-radius: 25px;
  background-color: var(--color-white);
  display: none;
  max-width: 100%;
`;
const H = styled.h1`
  margin: 0;
  position: relative;
  font-size: inherit;
  line-height: 28px;
  font-weight: 700;
  font-family: inherit;
  z-index: 1;
  @media screen and (max-width: 950px) {
    font-size: var(--font-size-26);
    line-height: 22px;
  }
  @media screen and (max-width: 450px) {
    font-size: var(--font-size-19);
    line-height: 17px;
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0px 108px;
  box-sizing: border-box;
  max-width: 100%;
  @media screen and (max-width: 700px) {
    padding-left: 54px;
    padding-right: 54px;
    box-sizing: border-box;
  }
  @media screen and (max-width: 450px) {
    padding-left: var(--padding-20);
    padding-right: var(--padding-20);
    box-sizing: border-box;
  }
`;
const Title1 = styled.div`
  position: relative;
  font-size: var(--font-size-22);
  line-height: 24px;
  font-weight: 600;
  font-family: var(--font-pretendard);
  color: var(--color-white);
  text-align: left;
  @media screen and (max-width: 450px) {
    font-size: var(--font-size-18);
    line-height: 19px;
  }
`;
const Primary = styled.div`
  flex: 1;
  border-radius: var(--br-8);
  background-color: var(--color-mediumpurple-300);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--padding-12);
  box-sizing: border-box;
  max-width: 100%;
  transition: all 0.2s ease;
`;
const Button1 = styled.button`
  cursor: pointer;
  border: none;
  padding: 0.5px 0px 0px;
  background-color: transparent;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  max-width: 100%;
  z-index: 1;
  transition: transform 0.2s ease;

  &:hover {
    ${Primary} {
      background-color: #7742A7;
      box-shadow: 0 4px 8px rgba(119, 66, 167, 0.3);
      transform: scale(1.02);
    }
  }
`;
const ButtonWrapper = styled.div`
  width: 509.5px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0px var(--padding-1);
  box-sizing: border-box;
  max-width: 100%;
`;
const FrameParent = styled.form`
  margin: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 18.5px;
  max-width: 100%;
`;
const RectangleParentRoot = styled.div`
  position: absolute;
  top: 351px;
  left: calc(50% - 385px);
  border-radius: 25px;
  background-color: var(--color-white);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  padding: var(--padding-60) 140px 51.5px 118px;
  box-sizing: border-box;
  gap: 51.5px;
  width: 780px;
  height: 510px;
  max-width: 100%;
  text-align: center;
  font-size: var(--font-size-32);
  color: var(--color-black);
  font-family: var(--font-pretendard);
  @media screen and (max-width: 950px) {
    padding-left: 59px;
    padding-right: 70px;
    box-sizing: border-box;
  }
  @media screen and (max-width: 700px) {
    padding-top: 39px;
    padding-bottom: 33px;
    box-sizing: border-box;
  }
  @media screen and (max-width: 450px) {
    gap: var(--gap-26);
    padding-left: var(--padding-20);
    padding-right: var(--padding-20);
    box-sizing: border-box;
  }
`;

const LoginForm = ({ 
  className = "",
  email = "",
  password = "",
  onEmailChange,
  onPasswordChange,
  onLogin
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <RectangleParentRoot className={className}>
      <FrameChild />
      <Wrapper>
        <H>다시 만나서 반가워요 :)</H>
      </Wrapper>
      <FrameParent onSubmit={handleSubmit}>
        <EmailInputField 
          title="아이디" 
          placeholder="이메일을 입력하세요."
          value={email}
          onChange={onEmailChange}
        />
        <InputField
          inputWidth="510px"
          inputAlignSelf="unset"
          title="비밀번호"
          placeholder="비밀번호를 입력하세요."
          type="password"
          value={password}
          onChange={onPasswordChange}
        />
        <ButtonWrapper>
          <Button1 type="submit">
            <Primary>
              <Title1>로그인</Title1>
            </Primary>
          </Button1>
        </ButtonWrapper>
      </FrameParent>
    </RectangleParentRoot>
  );
};

LoginForm.propTypes = {
  className: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
  onEmailChange: PropTypes.func,
  onPasswordChange: PropTypes.func,
  onLogin: PropTypes.func,
};

export default LoginForm; 