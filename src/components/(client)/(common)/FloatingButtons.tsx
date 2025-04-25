"use client";

import React, { useState, useEffect } from 'react';
import LuckyWheelToggle from './LuckyWheelToggle';
import FloatingSocialIcons from '@/components/SocialButton';

interface Position {
  x: number;
  y: number;
}

const FloatingButtons: React.FC = () => {
  const [luckyWheelPos, setLuckyWheelPos] = useState<Position>({ x: 20, y: window.innerHeight / 2 });
  const [contactPos, setContactPos] = useState<Position>({ x: window.innerWidth - 80, y: window.innerHeight / 2 });
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, button: string) => {
    setIsDragging(button);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;

    // Giới hạn vị trí trong viewport
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 80;
    const boundedX = Math.max(0, Math.min(x, maxX));
    const boundedY = Math.max(0, Math.min(y, maxY));

    if (isDragging === 'luckyWheel') {
      setLuckyWheelPos({ x: boundedX, y: boundedY });
    } else if (isDragging === 'contact') {
      setContactPos({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const buttonStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease',
    position: 'fixed' as const,
    transform: 'translate(-50%, -50%)',
    zIndex: 50,
  };

  const containerStyle = {
    position: 'fixed' as const,
    transform: 'translate(-50%, -50%)',
    zIndex: 50,
  };

  return (
    <>
      {/* Lucky Wheel Button */}
      <div
        style={{
          ...containerStyle,
          left: `${luckyWheelPos.x}px`,
          top: `${luckyWheelPos.y}px`,
          cursor: isDragging === 'luckyWheel' ? 'grabbing' : 'grab',
        }}
        onMouseDown={(e) => handleMouseDown(e, 'luckyWheel')}
      >
        <div style={{
          ...buttonStyle,
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        }}>
          <LuckyWheelToggle />
        </div>
      </div>

      {/* Contact Button */}
      <div
        style={{
          ...containerStyle,
          left: `${contactPos.x}px`,
          top: `${contactPos.y}px`,
          cursor: isDragging === 'contact' ? 'grabbing' : 'grab',
        }}
        onMouseDown={(e) => handleMouseDown(e, 'contact')}
      >
        <div style={{
          ...buttonStyle,
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        }}>
          <FloatingSocialIcons position="right" offset={0} />
        </div>
      </div>
    </>
  );
};

export default FloatingButtons; 