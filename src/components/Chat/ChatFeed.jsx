import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Image as ImageIcon, Video as VideoIcon, Mic, Sparkles, User, UserCheck } from 'lucide-react';
import BhavnaAvatar from '../Avatar/BhavnaAvatar';

export default function ChatFeed({
  messages,
  isThinking,
  onPlayAudio,
  currentlyPlayingId,
  user,
  voiceGender,
  onOpenPhotoLightbox
}) {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '20px 16px 140px',
      maxWidth: '860px',
      width: '100%',
      margin: '0 auto'
    }}>
      {messages.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <BhavnaAvatar state="idle" size="large" />
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-charcoal)' }}>
            How can Bhavna AI help you today?
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', maxWidth: '480px', lineHeight: 1.5 }}>
            Speak naturally, type a message, upload a photo, or start a live video call. I'm here to listen, analyze, and assist!
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isPlaying = currentlyPlayingId === msg.id;

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              {/* Avatar Icon */}
              {isUser ? (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-yellow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  {user ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              ) : (
                <BhavnaAvatar state={isPlaying ? 'speaking' : 'idle'} size="small" />
              )}

              {/* Message Bubble Card */}
              <div style={{
                maxWidth: '78%',
                backgroundColor: isUser ? 'var(--color-primary-yellow-light)' : 'var(--color-card-bg)',
                border: isUser ? '1px solid var(--color-primary-yellow-border)' : '1px solid var(--color-border)',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '14px 18px',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative'
              }}>
                {/* Header info */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-charcoal)' }}>
                    {isUser ? (user ? user.name : 'You') : 'Bhavna AI 💛'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {msg.timestamp || 'Just now'}
                  </span>
                </div>

                {/* Photo attachment preview */}
                {msg.photo && (
                  <div style={{ marginBottom: '10px' }}>
                    <img
                      src={msg.photo.url}
                      alt="Attachment"
                      onClick={() => onOpenPhotoLightbox && onOpenPhotoLightbox(msg.photo.url)}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '260px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: '1px solid var(--color-border)'
                      }}
                    />
                  </div>
                )}

                {/* Video attachment preview */}
                {msg.video && (
                  <div style={{ marginBottom: '10px' }}>
                    <video
                      controls
                      src={msg.video.url}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '260px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                      }}
                    />
                  </div>
                )}

                {/* Text Message Content */}
                {msg.text && (
                  <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-charcoal)', whitespace: 'pre-wrap' }}>
                    {msg.text}
                  </div>
                )}

                {/* Audio Wave Visualizer & Voice Controls for AI responses */}
                {!isUser && (
                  <div style={{
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <button
                      onClick={() => onPlayAudio(msg)}
                      style={{
                        background: isPlaying ? 'var(--color-primary-yellow)' : 'var(--color-bg-subtle)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-full)',
                        padding: '6px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      {isPlaying ? 'Pause Voice' : 'Listen Voice'}
                    </button>

                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Voice: {voiceGender === 'female' ? '👩 Female ♀' : '👨 Male ♂'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Thinking Indicator */}
      {isThinking && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
          <BhavnaAvatar state="thinking" size="small" />
          <div style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '18px 18px 18px 4px',
            padding: '12px 18px',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} color="var(--color-primary-yellow-hover)" className="animate-spin-slow" />
            Bhavna is reflecting & generating response...
          </div>
        </div>
      )}
    </div>
  );
}
