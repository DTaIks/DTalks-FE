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
        <Box 
            className={isSelected ? 'selected' : ''} 
            onClick={onClick}
        >
            {icon && <IconWrapper>{icon}</IconWrapper>}
            <Title>{title}</Title>
        </Box>
    );
};

export default DepartmentBox;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-right: 16px;
`;

const Title = styled.span`
    color: #222;
    font-size: var(--font-size-16);
    font-weight: var(--font-weight-500);
    line-height: normal;
    transition: all 0.2s ease;
`;

const Box = styled.div`
    width: 208px;
    height: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    background: #F8F9FA;
    padding: 4px 0 4px 32px;
    border-right: 4px solid transparent;
    transition: all 0.2s ease;
    
    &.selected {
        background: linear-gradient(to right, #8061B01A 100%);
        border-right: 4px solid var(--color-medium-purple-300);
        
        ${Title} {
            color: var(--color-mediumpurple-400);
            font-weight: var(--font-weight-600);
        }
    }
         
    &:hover {
        background: linear-gradient(to left, #8061B01A 100%);
    }
`;
