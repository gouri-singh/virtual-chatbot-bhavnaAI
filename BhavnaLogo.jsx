import React from 'react';

export default function BhavnaLogo({ size = 32, animated = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* Primary Warm Yellow Gradient */}
        <linearGradient id="bhavnaGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="45%" stopColor="#F2B705" />
          <stop offset="100%" stopColor="#D99B00" />
        </linearGradient>

        {/* Outer Soft Glow */}
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Emotion Heart/Smile Accent Gradient */}
        <linearGradient id="bhavnaAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1A1A1A" />
          <stop offset="100%" stopColor="#333333" />
        </linearGradient>
      </defs>

      {/* Main Friendly Speech Bubble Shape */}
      <path
        d="M50 10 C 26 10, 10 24, 10 44 C 10 55, 16 65, 26 71 C 24 79, 18 86, 12 90 C 26 90, 36 84, 43 77 C 45 77.6, 48 78, 50 78 C 74 78, 90 64, 90 44 C 90 24, 74 10, 50 10 Z"
        fill="url(#bhavnaGold)"
        filter="url(#goldGlow)"
      />

      {/* Inner White Backdrop Surface for Emotion Wave */}
      <path
        d="M50 16 C 30 16, 16 28, 16 44 C 16 53, 21 61, 30 66 C 34 68, 38 72, 40 76 C 43 76, 47 73, 50 73 C 70 73, 84 61, 84 44 C 84 28, 70 16, 50 16 Z"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* Embedded Sound Wave + Emotion Smile Motif */}
      {/* Sound Bar 1 */}
      <rect x="34" y="38" width="4" height="12" rx="2" fill="#1A1A1A" />
      {/* Sound Bar 2 (Center peak) */}
      <rect x="42" y="30" width="4" height="26" rx="2" fill="#F2B705" />
      {/* Center Emotion Smile Curve */}
      <path
        d="M36 50 Q 50 64, 64 50"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sound Bar 3 */}
      <rect x="54" y="30" width="4" height="26" rx="2" fill="#F2B705" />
      {/* Sound Bar 4 */}
      <rect x="62" y="38" width="4" height="12" rx="2" fill="#1A1A1A" />

      {/* Sparkling Warmth Indicator */}
      <circle cx="72" cy="26" r="5" fill="#F2B705" />
      <circle cx="72" cy="26" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}
