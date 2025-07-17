import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h3`
  color: #fff;
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: #a855f7;
  }
  
  &::placeholder {
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${props => props.$primary ? `
    background: #a855f7;
    color: white;
    
    &:hover {
      background: #9333ea;
    }
  ` : `
    background: transparent;
    color: #ccc;
    border: 1px solid #444;
    
    &:hover {
      background: #333;
      color: #fff;
    }
  `}
`;

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filename: string) => void;
  defaultFilename: string;
}

export function ExportDialog({ isOpen, onClose, onExport, defaultFilename }: ExportDialogProps) {
  const [filename, setFilename] = useState(defaultFilename);

  useEffect(() => {
    if (isOpen) {
      setFilename(defaultFilename);
    }
  }, [isOpen, defaultFilename]);

  const handleExport = () => {
    if (filename.trim()) {
      onExport(filename.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExport();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>Export Responses</Title>
        <Input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter filename..."
          autoFocus
        />
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button $primary onClick={handleExport}>
            Export
          </Button>
        </ButtonGroup>
      </Dialog>
    </Overlay>
  );
} 