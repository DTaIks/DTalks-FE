import React from 'react';
import styled from 'styled-components';

export interface DepartmentBoxProps {
    title: string;
    icon?: React.ReactNode;
    isSelected?: boolean;
    onClick?: () => void;
}

const DepartmentBox: React.FC<DepartmentBoxProps> = ({
   title,
   icon,
   isSelected = false,
   onClick
}) => {
    return (
        <Box isSelected={isSelected} onClick={onClick}>
            {icon && <IconWrapper>{icon}</IconWrapper>}
            <Title isSelected={isSelected}>{title}</Title>
        </Box>
    );
};

export default DepartmentBox;

const Box = styled.div<{ isSelected: boolean }>`
    width: 204px;
    height: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    background: ${props => props.isSelected ? 'linear-gradient(to right, #8061B01A 100%)' : '#F8F9FA'};
    padding: 4px 0 4px 32px;
    border-right: ${props => props.isSelected ? '4px solid #9966CC' : '4px solid transparent'};
    
    &:hover {
        background: linear-gradient(to left, #8061B01A 100%);
    }
     
    transition: all 0.2s ease;
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-right: 16px;
`;

const Title = styled.span<{ isSelected: boolean }>`
    color: ${props => props.isSelected ? '#8061B0' : '#222'};
    font-size: var(--font-size-16);
    font-weight: ${props => props.isSelected ? '600' : '500'};
    line-height: normal;
    transition: all 0.2s ease;
`;
