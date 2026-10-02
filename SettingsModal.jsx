import React from 'react';
import { X, Volume2, UserCheck, Moon, Sun, Sliders, Shield, Trash2, Check } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearData
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--color-bg-white)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={22} color="var(--color-primary-yellow-hover)" />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-charcoal)' }}>
              App Preferences
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* SECTION: VOICE OUTPUT */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '12px' }}>
            AI Voice Output (TTS)
          </label>

          {/* Voice Gender Switcher */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button
              onClick={() => onUpdateSettings({ voiceGender: 'female' })}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: settings.voiceGender === 'female' ? '2px solid #EC4899' : '1px solid var(--color-border)',
                backgroundColor: settings.voiceGender === 'female' ? '#FDF2F8' : 'var(--color-bg-white)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 700,
                color: settings.voiceGender === 'female' ? '#DB2777' : 'var(--color-text-secondary)'
              }}
            >
              👩 Female Voice ♀ {settings.voiceGender === 'female' && <Check size={16} />}
            </button>

            <button
              onClick={() => onUpdateSettings({ voiceGender: 'male' })}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: settings.voiceGender === 'male' ? '2px solid #3B82F6' : '1px solid var(--color-border)',
                backgroundColor: settings.voiceGender === 'male' ? '#EFF6FF' : 'var(--color-bg-white)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 700,
                color: settings.voiceGender === 'male' ? '#2563EB' : 'var(--color-text-secondary)'
              }}
            >
              👨 Male Voice ♂ {settings.voiceGender === 'male' && <Check size={16} />}
            </button>
          </div>

          {/* Auto Read Aloud Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Auto-Play Audio Response</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Automatically speak AI text answers</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSpeak}
              onChange={(e) => onUpdateSettings({ autoSpeak: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-yellow)' }}
            />
          </div>

          {/* Speech Rate Slider */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>Speech Speed</span>
              <span>{settings.speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.05"
              value={settings.speechRate}
              onChange={(e) => onUpdateSettings({ speechRate: parseFloat(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--color-primary-yellow)' }}
            />
          </div>
        </div>

        {/* SECTION: APPEARANCE */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '12px' }}>
            Theme & Appearance
          </label>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => onUpdateSettings({ theme: 'light' })}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: settings.theme === 'light' ? '2px solid var(--color-primary-yellow)' : '1px solid var(--color-border)',
                backgroundColor: settings.theme === 'light' ? 'var(--color-primary-yellow-light)' : 'var(--color-bg-white)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600
              }}
            >
              <Sun size={18} color="#F2B705" /> Light Mode
            </button>

            <button
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: settings.theme === 'dark' ? '2px solid var(--color-primary-yellow)' : '1px solid var(--color-border)',
                backgroundColor: settings.theme === 'dark' ? '#242A32' : 'var(--color-bg-white)',
                color: settings.theme === 'dark' ? '#FFFFFF' : 'var(--color-text-charcoal)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600
              }}
            >
              <Moon size={18} color="#F2B705" /> Dark Mode
            </button>
          </div>
        </div>

        {/* SECTION: PRIVACY & DATA */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '12px' }}>
            Privacy & Data Controls
          </label>
          
          <button
            onClick={onClearData}
            className="btn-secondary"
            style={{ width: '100%', color: 'var(--color-error)', borderColor: '#FCA5A5', justifyContent: 'flex-start' }}
          >
            <Trash2 size={16} /> Clear All Conversation History & Media
          </button>
        </div>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', padding: '12px' }}
        >
          Save & Close
        </button>
      </div>
    </div>
  );
}
