import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SupercomputerIconProps } from '../types';

const Container = styled.div`
  width: 120px;
  height: 200px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const PurpleGlow = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(88, 31, 140, 0.85) 0%, rgba(88, 31, 140, 0.45) 40%, rgba(88, 31, 140, 0) 70%);
  filter: blur(40px);
  animation: pulseGlow 2s ease-in-out infinite;
  z-index: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  pointer-events: none;
`;

const SlotsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  z-index: 1;
  transform: translateY(-20px);
`;

const Slot = styled.div<{ $isProcessing: boolean, $delay: number }>`
  width: 49%;
  height: 10px;
  background: transparent;
  animation: ${props => props.$isProcessing ? `neonPulse 0.8s ease-in-out ${props.$delay}s infinite` : 'none'};
  opacity: ${props => props.$isProcessing ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ComputerImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 2;
  pointer-events: none;
`;

const Computer3DContainer = styled.div<{ $flipped: boolean }>`
  width: 100%;
  height: 100%;
  perspective: 800px;
`;

const Computer3D = styled.div<{ $flipped: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 1.2s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform: ${props => props.$flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const ComputerFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  z-index: 2;
`;

const ComputerBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  z-index: 3;
`;

const ModelLabel = styled.div<{ $mode: 'economy' | 'pro' | 'premium' }>`
  position: absolute;
  color: #111;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  white-space: pre-line;
  margin-top: ${props => props.$mode === 'premium' ? '1px' : '12px'};
  margin-left: ${props => 
    props.$mode === 'economy' ? '29px' : 
    props.$mode === 'pro' ? '37px' : 
    '30px'
  };
  z-index: 4;
`;

export function SupercomputerIcon({ 
  teamId,
  onClick,
  isSelected = false,
  isCurrentlyProcessing = false,
  mode = 'economy',
  triggerFlip = 0,
  modelLabels = [],
}: SupercomputerIconProps & { mode?: 'economy' | 'pro' | 'premium', triggerFlip?: number, modelLabels?: string[] }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (triggerFlip > 0) {
      console.log('🔄 Starting flip animation for computer', teamId);
      setFlipped(true);
      
      // Wait 5 seconds, then flip back
      const timer = setTimeout(() => {
        console.log('🔄 Flipping back for computer', teamId);
        setFlipped(false);
      }, 5000);
      
      return () => {
        clearTimeout(timer);
        console.log('🧹 Cleanup flip animation for computer', teamId);
      };
    }
  }, [triggerFlip, teamId]);

  // Get unique base offset for each computer
  const getBaseOffset = (id: number) => {
    switch(id) {
      case 1: return 0;
      case 2: return 0.2;
      case 3: return 0.4;
      case 4: return 0.6;
      default: return 0;
    }
  };

  // Get delay for each slot, incorporating both direction and base offset
  const getDelay = (index: number) => {
    const baseOffset = getBaseOffset(teamId);
    const isDownward = teamId % 2 === 1;
    const slotDelay = isDownward ? index * 0.15 : (5 - index) * 0.15;
    return baseOffset + slotDelay;
  };

  return (
    <Container onClick={onClick}>
      <Computer3DContainer $flipped={flipped}>
        <Computer3D $flipped={flipped}>
          <ComputerFront>
            {isSelected && <PurpleGlow $isVisible={isSelected} />}
            {/* Slot animations with digital rain overlay */}
            <SlotsContainer>
              {Array(6).fill(null).map((_, index) => (
                <Slot
                  key={index}
                  $isProcessing={isCurrentlyProcessing}
                  $delay={getDelay(index)}
                />
              ))}
            </SlotsContainer>
            <ComputerImage
              src="/images/supercomputer2.png"
              alt="Supercomputer"
            />
          </ComputerFront>
          <ComputerBack>
            <ComputerImage
              src="/images/supercomputerback2.png"
              alt="Supercomputer Back"
              style={{ opacity: 1 }}
            />
            <ModelLabel $mode={mode}>
              {modelLabels.map((label, idx) => (
                <div key={idx}>{label}</div>
              ))}
            </ModelLabel>
          </ComputerBack>
        </Computer3D>
      </Computer3DContainer>
    </Container>
  );
}
