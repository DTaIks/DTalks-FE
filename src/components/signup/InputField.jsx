import React from 'react';
import styled from 'styled-components';
import ActionButton from './ActionButton';

export default function InputField({
  label,
  placeholder,
  inputProps,
  infoText,
  infoTextColor,
  buttonText,
  onButtonClick,
  buttonDisabled = false
}) {
  const hasButton = !!buttonText;
  
  return (
    <InputRow>
      <Label>{label}</Label>
      <InputWrapper hasButton={hasButton}>
        <Input 
          {...inputProps}
          placeholder={placeholder}
          hasButton={hasButton}
        />
        {hasButton && (
          <ActionButton
            text={buttonText}
            onClick={onButtonClick}
            disabled={buttonDisabled}
            width="166px"
            height="46px"
            fontSize="14px"
          />
        )}
      </InputWrapper>
      {infoText && <InfoText color={infoTextColor}>{infoText}</InfoText>}
    </InputRow>
  );
}

const InputRow = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const InputWrapper = styled.div`
  display: ${props => props.hasButton ? 'flex' : 'flex'};
  padding: ${props => props.hasButton ? '0' : '8px 12px'};
  align-items: center;
  justify-content: center; /* 입력칸을 가운데 정렬 */
  gap: ${props => props.hasButton ? '8px' : '0'};
  width: 100%;
  box-sizing: border-box;
`;

const Label = styled.label`
  color: #000;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  display: block;
  margin-bottom: 16px;
  text-align: left;
  width: 100%;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  padding-left: calc((100% - 508px) / 2);
`;

const Input = styled.input`
  display: flex;
  width: ${props => props.hasButton ? '334px' : '508px'};
  height: 46px;
  padding: 8px 12px;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: #FFF;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  
  &:focus {
    border-color: #8061B0;
    box-shadow: 0 0 8px #a899f8;
  }
`;

const InfoText = styled.div`
  font-size: 11px;
  color: ${props => props.color || '#8c8c8c'};
  margin-top: 4px;
  line-height: 1.2;
  text-align: left;
  width: 100%;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  padding-left: calc((100% - 508px) / 2 + 12px);
`;
