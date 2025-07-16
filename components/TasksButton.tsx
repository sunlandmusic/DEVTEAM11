import React from 'react';
import styled from 'styled-components';
import MultiTaskIcon from '../public/images/TOOLBAR ICONS/MultiTask.png';

const TasksIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="2"/>
    <path d="M9 14l2 2 4-4"/>
  </svg>
);

const TooltipContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Tooltip = styled.span`
  position: absolute;
  top: -44px;
  left: 50%;
  transform: translateX(-50%);
  background: #111;
  color: rgba(255, 255, 255, 0.95);
  padding: 4px 8px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;

  ${TooltipContainer}:hover & {
    opacity: 1;
  }
`;

const ToolButton = styled.button<{ $isDisabled?: boolean; $isActive?: boolean }>`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.$isActive ? 'rgba(128, 0, 128, 0.3)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  // Remove opacity from button, let the image show at full brightness

  &:hover:not(:disabled) {
    background-color: rgba(128, 0, 128, 0.3);
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    background-color: rgba(128, 0, 128, 0.4);
  }

  // Remove svg color/opacity styling
`;

interface TasksButtonProps {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function TasksButton({ isActive, onToggle, disabled }: TasksButtonProps) {
  const handleClick = () => {
    console.log('TasksButton clicked! isActive:', isActive, 'disabled:', disabled);
    onToggle();
  };

  return (
    <TooltipContainer>
      <Tooltip>Multi-Task</Tooltip>
      <ToolButton 
        onClick={handleClick} 
        $isDisabled={disabled}
        $isActive={isActive}
      >
        <img src={MultiTaskIcon} alt="MultiTask" style={{ width: 32, height: 32, filter: 'none' }} />
      </ToolButton>
    </TooltipContainer>
  );
} 