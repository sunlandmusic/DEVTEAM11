import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { TasksButton } from './TasksButton';
import { useAutomationStore } from '../services/store';
import { UsageIndicator } from './UsageIndicator';
import { OpenRouterService } from '../services/OpenRouterService';
import AttachIcon from '../public/images/TOOLBAR ICONS/Attach.png';
import PromptIcon from '../public/images/TOOLBAR ICONS/Prompt.png';
import MultiTaskIcon from '../public/images/TOOLBAR ICONS/MultiTask.png';
import UsageIcon from '../public/images/TOOLBAR ICONS/Usage.png';
import StartIcon from '../public/images/TOOLBAR ICONS/START.png';

const ToolbarContainer = styled.div`
  width: 100%;
  max-width: 36rem;
  background: rgba(51, 51, 51, 0.8);
  backdrop-filter: blur(8px);
  padding: 0.206rem;
  border-radius: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const TooltipContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;

  &:hover {
    z-index: 99999;
  }
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

const ToolButton = styled.button<{ $isDisabled?: boolean; $isSend?: boolean; $isStop?: boolean; $isActive?: boolean }>`
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
  // opacity: ${props => props.$isDisabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.2);
  }

  // Remove svg color/opacity styling
`;

interface ToolbarProps {
  disabled?: boolean;
  onTaskModeChange: (isTaskMode: boolean) => void;
  isTaskMode: boolean;
  onSend: () => void;
  onStop?: () => void;
  hasTasks: boolean;
  isProcessing: boolean;
  setDevTeamPrompt: (prompt: string) => void;
  setTaskPrompt?: (prompt: string) => void; // <-- Add this line
}

export function Toolbar({ 
  disabled, 
  onTaskModeChange, 
  isTaskMode, 
  onSend, 
  onStop,
  hasTasks,
  isProcessing,
  setDevTeamPrompt,
  setTaskPrompt // <-- Add this line
}: ToolbarProps) {
  const openRouterService = OpenRouterService();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const [showUsage, setShowUsage] = useState(false);
  const { used: usedCredits, total: totalCredits } = OpenRouterService().getCredits();
  const { addAttachment, updateAttachment, setDevTeamSelectedTeams } = useAutomationStore();

  const MAX_FILE_SIZE = 1024 * 1024; // 1MB

  // Add state for prompt dropdown
  const [showPromptDropdown, setShowPromptDropdown] = useState(false);
  const promptOptions = [
    { label: 'Overview', value: 'please develop an overview document from my attached file/s' },
    { label: 'P.R.D.', value: 'please develop a P.R.D. from my attached file/s' },
    { label: 'Task List', value: 'please develop a Task List from my attached file/s' },
    { label: 'Clean', value: 'please Compile, Summarize, Remove Duplicate Data, Format, and Label data in an organized format' },
    { label: 'Summarize', value: 'please summarize my attached file/s' },
    { label: 'Build an Expert', value: 'I want to build a custom A.I. model. It should be able to:\n\n... please help me answer these questions about the model :\n3. Name ?\n4. Description ?\n5. Instructions ?' },
    { label: 'Data Sets', value: 'please help me collect data sets, to build a knowledge base for my attached file/s\n1. make a list of data we need to research, collect and compile.\n2. then break the data acquisition process into stages.' },
    { label: 'Double Check', value: 'My attached file/s act as a knowledge base for my custom A.I. model. please look over the document/s and let me know if it has all the data needed for the model to be highly effective and extremely helpful - please advise.\nIf more data is needed, make a list of specific data needed to fill the gaps. and then make a list of the data acquisition broken up into stages' },
    { label: 'Collect Data', value: 'please read my attached document. please research, collect data and create data sets for STAGE 1 (mentioned in the document)' },
  ];

  return (
    <ToolbarContainer>
      <TooltipContainer>
        <ToolButton $isDisabled={disabled} onClick={() => fileInputRef.current?.click()}>
          <img src={AttachIcon} alt="Attach" style={{ width: 32, height: 32 }} />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={e => {
              const files = e.target.files;
              if (!files) return;
              
              for (const file of Array.from(files)) {
                // Check file size
                if (file.size > MAX_FILE_SIZE) {
                  alert(`File ${file.name} is too large. Maximum size is 1MB.`);
                  continue;
                }
                
                // Add file to store
                const attachment = addAttachment(file.name);
                
                // Read file content and update attachment
                const reader = new FileReader();
                reader.onload = (event) => {
                  const content = event.target?.result as string;
                  console.log(`📁 File "${file.name}" content loaded:`, content.substring(0, 100) + '...');
                  // Update attachment with content
                  updateAttachment(attachment.id, 'success', undefined, content);
                  console.log(`✅ Attachment "${file.name}" updated with content`);
                };
                reader.readAsText(file);
              }
              
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            style={{ display: 'none' }}
            accept="*/*"
          />
        </ToolButton>
        <Tooltip>Attach (file upload max 1MB)</Tooltip>
      </TooltipContainer>

      <TooltipContainer style={{ position: 'relative' }}>
        <ToolButton $isDisabled={disabled} onClick={() => setShowPromptDropdown(v => !v)}>
          <img src={PromptIcon} alt="Prompt" style={{ width: 32, height: 32 }} />
        </ToolButton>
        <Tooltip>Prompt</Tooltip>
        {showPromptDropdown && (
          <div style={{
            position: 'absolute',
            top: '54px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#222',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            padding: '8px 0',
            minWidth: 160,
            zIndex: 2000,
          }}>
            {promptOptions.map(opt => (
              <button
                key={opt.label}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 15,
                  padding: '8px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => {
                  setShowPromptDropdown(false);
                  console.log('🔍 Prompt button clicked:', { isTaskMode, hasSetTaskPrompt: !!setTaskPrompt, promptValue: opt.value });
                  // Only update the correct prompt field
                  if (isTaskMode && setTaskPrompt) {
                    console.log('📝 Setting task prompt:', opt.value);
                    setTaskPrompt(opt.value);
                  } else {
                    console.log('📝 Setting dev team prompt:', opt.value);
                    setDevTeamPrompt(opt.value);
                  }
                  // Auto-select Team 1 when prompt is selected
                  setDevTeamSelectedTeams([1]);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </TooltipContainer>

      <TooltipContainer>
        <TasksButton 
          isActive={isTaskMode}
          onToggle={() => onTaskModeChange(!isTaskMode)}
          disabled={disabled}
        />
      </TooltipContainer>

      <TooltipContainer>
        <ToolButton 
          ref={settingsButtonRef}
          onClick={() => setShowUsage(!showUsage)}
          $isDisabled={disabled}
        >
          <img src={UsageIcon} alt="Usage" style={{ width: 32, height: 32 }} />
        </ToolButton>
        <Tooltip>Usage</Tooltip>
        <UsageIndicator 
          isVisible={showUsage}
          usedCredits={usedCredits}
          totalCredits={totalCredits}
          buttonRef={settingsButtonRef}
        />
      </TooltipContainer>

      <TooltipContainer>
        <ToolButton onClick={isProcessing ? onStop : onSend} $isDisabled={disabled} $isSend={!isProcessing} $isStop={isProcessing} style={{ backgroundColor: isProcessing ? 'rgba(0, 0, 0, 0.8)' : 'transparent' }}>
          <img src={StartIcon} alt="Start" style={{ width: 32, height: 32, transform: isProcessing ? 'rotate(180deg)' : 'rotate(22deg)' }} />
        </ToolButton>
        <Tooltip>{isProcessing ? 'Stop' : 'Start'}</Tooltip>
      </TooltipContainer>
    </ToolbarContainer>
  );
}