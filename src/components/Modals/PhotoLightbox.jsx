import React from 'react';
import { X, Download } from 'lucide-react';

export default function PhotoLightbox({ photoUrl, onClose }) {
  if (!photoUrl) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1200,
      padding: '20px'
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: '#FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X size={24} />
      </button>

      <img
        src={photoUrl}
        alt="Enlarged visual"
        style={{
          maxWidth: '90vw',
          maxHeight: '85vh',
          borderRadius: 'var(--radius-md)',
          objectFit: 'contain',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}
      />
    </div>
  );
}
