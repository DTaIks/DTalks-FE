import React from 'react';
import styled from "styled-components";

interface EmailInputFieldProps {
  className?: string;
  inputWidth?: string;
  inputAlignSelf?: string;
  title: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Title = styled.div`
  align-self: stretch;
  position: relative;
  line-height: 20px;
  font-weight: 500;
`;

const Text = styled.input`
  flex: 1;
  position: relative;
  line-height: 20px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 20px;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-pretendard);
  font-size: var(--font-size-20);
  color: var(--color-gray-100);
  width: 100%;
  padding: 0;
`;

const Textfield = styled.div`
  align-self: stretch;
  border-radius: var(--br-6);
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  box-sizing: border-box;
  height: 46px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: var(--padding-8) var(--padding-12);
  font-size: var(--font-size-20);
  color: var(--color-gray-100);
`;

const InputRoot = styled.div<{ inputWidth?: string; inputAlignSelf?: string }>`
  width: 510px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--gap-16);
  text-align: left;
  font-size: var(--font-size-22);
  color: var(--color-black);
  font-family: var(--font-pretendard);
  width: ${(p) => p.inputWidth};
  align-self: ${(p) => p.inputAlignSelf};
`;

const EmailInputField: React.FC<EmailInputFieldProps> = ({
  className = "",
  inputWidth,
  inputAlignSelf,
  title,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <InputRoot
      inputWidth={inputWidth}
      inputAlignSelf={inputAlignSelf}
      className={className}
    >
      <Title>{title}</Title>
      <Textfield>
        <Text 
          type="email"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </Textfield>
    </InputRoot>
  );
};

export default EmailInputField; 