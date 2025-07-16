import React from 'react';
import styled from 'styled-components';

interface DigitalRainAnimationProps {
  isProcessing: boolean;
  speed?: number;
}

const Container = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  width: calc(50% + 25px);
  height: calc(50% + 25px);
  top: calc(25% - 12.5px);
  left: calc(25% - 12.5px);
  z-index: 3;
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.5s ease, visibility 0.5s ease;
  pointer-events: none;
`;

const DigitalRainGif = styled.img<{ $speed: number }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8) contrast(1.2);
  animation: ${props => props.$speed !== 1 ? `speedUp ${props.$speed}s linear infinite` : 'none'};
  
  @keyframes speedUp {
    0% { transform: translateY(0); }
    100% { transform: translateY(-100%); }
  }
`;

export function DigitalRainAnimation({ isProcessing, speed = 1 }: DigitalRainAnimationProps) {
  return (
    <Container $isVisible={isProcessing}>
      <DigitalRainGif
        src="/images/Digital_rain_animation_medium_letters_shine.gif"
        alt="Digital Rain Animation"
        $speed={speed}
      />
    </Container>
  );
} 