'use client';

import React from 'react';

/**
 * 4-Corner Precision Crop Marks for cards and editorial containers
 */
export const CropMarks: React.FC<{ color?: string; size?: number; opacity?: number }> = ({
  color = 'var(--gold-warm)',
  size = 12,
  opacity = 0.6,
}) => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: `${size}px`,
          height: `${size}px`,
          borderTop: `1.5px solid ${color}`,
          borderLeft: `1.5px solid ${color}`,
          opacity,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: `${size}px`,
          height: `${size}px`,
          borderTop: `1.5px solid ${color}`,
          borderRight: `1.5px solid ${color}`,
          opacity,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: `${size}px`,
          height: `${size}px`,
          borderBottom: `1.5px solid ${color}`,
          borderLeft: `1.5px solid ${color}`,
          opacity,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: `${size}px`,
          height: `${size}px`,
          borderBottom: `1.5px solid ${color}`,
          borderRight: `1.5px solid ${color}`,
          opacity,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

/**
 * Precision Circular Registration Crosshair SVG
 */
export const RegistrationMark: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 28,
  color = '#C9A227',
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <circle cx="20" cy="20" r="14" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
      <circle cx="20" cy="20" r="8" stroke={color} strokeWidth="1.5" opacity="0.8" />
      <path d="M20 2V38" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 20H38" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2" fill={color} />
    </svg>
  );
};

/**
 * CMYK Process Registration Calibration Dots
 */
export const CmykAlignmentDots: React.FC<{ size?: number }> = ({ size = 6 }) => {
  return (
    <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
      <span style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', backgroundColor: '#00AEEF' }} title="Cyan" />
      <span style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', backgroundColor: '#EC008C' }} title="Magenta" />
      <span style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', backgroundColor: '#FFF200' }} title="Yellow" />
      <span style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', backgroundColor: '#0B1F33' }} title="Navy / Key" />
    </div>
  );
};

/**
 * Subtle Millimeter Print Measurement Ruler Guide
 */
export const PrintRulerGuide: React.FC<{ width?: string }> = ({ width = '100%' }) => {
  return (
    <div
      style={{
        width,
        height: '8px',
        background: 'repeating-linear-gradient(90deg, #C9A227 0, #C9A227 1px, transparent 1px, transparent 10px)',
        opacity: 0.35,
        margin: '8px 0',
      }}
    />
  );
};
