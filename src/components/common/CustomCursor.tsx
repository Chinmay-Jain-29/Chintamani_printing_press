'use client';

import React, { useEffect, useState } from 'react';
import { isReducedMotion } from '@/animations';

export const CustomCursor: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (typeof window === 'undefined' || isReducedMotion()) return;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth trailing animation loop
    let animationFrameId: number;
    const updateTrailing = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.2,
        y: prev.y + (position.y - prev.y) * 0.2,
      }));
      animationFrameId = requestAnimationFrame(updateTrailing);
    };
    animationFrameId = requestAnimationFrame(updateTrailing);

    // Hover state detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.card') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [position.x, position.y, isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <>
      {/* Precision Gold Center Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: '#C9A227',
          borderRadius: '50%',
          transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)`,
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'transform 0.04s ease-out',
        }}
      />

      {/* Smooth Trailing Follower Ring */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '42px' : '26px',
          height: isHovered ? '42px' : '26px',
          border: isHovered ? '1.5px solid #C9A227' : '1px solid rgba(11, 31, 51, 0.35)',
          backgroundColor: isHovered ? 'rgba(201, 162, 39, 0.08)' : 'transparent',
          borderRadius: '50%',
          transform: `translate3d(${trailingPos.x - (isHovered ? 21 : 13)}px, ${trailingPos.y - (isHovered ? 21 : 13)}px, 0)`,
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
        }}
      />
    </>
  );
};
