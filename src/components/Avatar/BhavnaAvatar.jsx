import React from 'react';
import { Mic, Volume2, Loader2 } from 'lucide-react';
import BhavnaLogo from './BhavnaLogo';

export default function BhavnaAvatar({ state = 'idle', size = 'medium' }) {
  // state: 'idle' | 'listening' | 'thinking' | 'speaking'
  // size: 'small' (36px), 'medium' (64px), 'large' (96px)

  const dimensionMap = {
    small: { container: 42, icon: 26 },
    medium: { container: 68, icon: 42 },
    large: { container: 104, icon: 64 }
  };

  const dims = dimensionMap[size] || dimensionMap.medium;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Listening Wave Ripples */}
      {state === 'listening' && (
        <>
          <div style={{
            position: 'absolute',
            width: `${dims.container + 24}px`,
            height: `${dims.container + 24}px`,
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            animation: 'pulseGlow 1.5s infinite ease-out'
          }} />
          <div style={{
            position: 'absolute',
            width: `${dims.container + 48}px`,
            height: `${dims.container + 48}px`,
            borderRadius: '50%',
            backgroundColor: 'rgba(242, 183, 5, 0.15)',
            animation: 'pulseGlow 2s infinite ease-out 0.4s'
          }} />
        </>
      )}

      {/* Thinking Orbit Rings */}
      {state === 'thinking' && (
        <div style={{
          position: 'absolute',
          width: `${dims.container + 16}px`,
          height: `${dims.container + 16}px`,
          borderRadius: '50%',
          border: '2px dashed var(--color-primary-yellow)',
          animation: 'spinSlow 4s linear infinite'
        }} />
      )}

      {/* Speaking Audio Equalizer Bars */}
      {state === 'speaking' && (
        <div style={{
          position: 'absolute',
          top: '-14px',
          display: 'flex',
          gap: '3px',
          alignItems: 'flex-end',
          height: '18px'
        }}>
          {[1, 2, 3, 4, 5].map(bar => (
            <div key={bar} style={{
              width: '3px',
              backgroundColor: 'var(--color-primary-yellow-hover)',
              borderRadius: '2px',
              animation: `soundWave ${0.4 + bar * 0.15}s ease-in-out infinite`
            }} />
          ))}
        </div>
      )}

      {/* Core Avatar Sphere Container */}
      <div 
        className={state === 'idle' ? 'animate-float' : ''}
        style={{
          width: `${dims.container}px`,
          height: `${dims.container}px`,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: state === 'speaking' ? 'var(--shadow-gold)' : 'var(--shadow-lg)',
          border: '2px solid var(--color-primary-yellow-border)',
          transition: 'all 0.3s ease',
          zIndex: 2,
          position: 'relative',
          padding: '4px'
        }}
      >
        {state === 'listening' ? (
          <Mic size={dims.icon * 0.7} color="#1D4ED8" className="animate-pulse" />
        ) : state === 'thinking' ? (
          <Loader2 size={dims.icon * 0.7} color="#1A1A1A" className="animate-spin-slow" />
        ) : state === 'speaking' ? (
          <Volume2 size={dims.icon * 0.7} color="#1A1A1A" />
        ) : (
          <BhavnaLogo size={dims.icon} />
        )}
      </div>
    </div>
  );
}
