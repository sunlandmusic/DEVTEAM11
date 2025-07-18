import React from 'react';
import styled from 'styled-components';
import { useAutomationStore } from '../services/store';

const DebugContainer = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: #00ff00;
  padding: 10px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 12px;
  max-width: 400px;
  max-height: 300px;
  overflow: auto;
  z-index: 9999;
  border: 1px solid #333;
`;

const DebugTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 14px;
`;

const DebugSection = styled.div`
  margin-bottom: 10px;
`;

const DebugLabel = styled.div`
  color: #aaa;
  font-weight: bold;
  margin-bottom: 2px;
`;

const DebugValue = styled.div`
  color: #00ff00;
  word-break: break-all;
`;

interface DebugPanelProps {
  taskQueue: any[];
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ taskQueue }) => {
  const { attachments } = useAutomationStore();

  return (
    <DebugContainer>
      <DebugTitle>🔍 Debug Panel</DebugTitle>
      
      <DebugSection>
        <DebugLabel>Attachments ({attachments.length}):</DebugLabel>
        <DebugValue>
          {attachments.map(att => (
            <div key={att.id}>
              • {att.name} - {att.status} - {att.content ? `${att.content.length} chars` : 'No content'}
            </div>
          ))}
        </DebugValue>
      </DebugSection>

      <DebugSection>
        <DebugLabel>Task Queue ({taskQueue.length}):</DebugLabel>
        <DebugValue>
          {taskQueue.map((task, idx) => (
            <div key={idx}>
              • Task {idx + 1}: Team {task.team} - {task.attachments?.length || 0} files
            </div>
          ))}
        </DebugValue>
      </DebugSection>

      <DebugSection>
        <DebugLabel>Status:</DebugLabel>
        <DebugValue>
          {attachments.length > 0 ? '✅ Files loaded' : '⏳ No files'}
          <br />
          {taskQueue.length > 0 ? '✅ Tasks queued' : '⏳ No tasks'}
        </DebugValue>
      </DebugSection>
    </DebugContainer>
  );
}; 