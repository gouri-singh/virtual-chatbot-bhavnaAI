import React, { useState, useRef } from 'react';
import { Send, Mic, MicOff, Camera, Video, Paperclip, X, Lock, UserCheck } from 'lucide-react';
import { speechService } from '../../services/speechService';

export default function InputBar({
  onSendMessage,
  onOpenPhotoModal,
  onOpenVideoModal,
  onStartVideoCall,
  isListening,
  setIsListening,
  user,
  onRequireAuth
}) {
  const [text, setText] = useState('');
  const [photoAttachment, setPhotoAttachment] = useState(null);
  const [videoAttachment, setVideoAttachment] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const checkAuth = (callback) => {
    if (!user) {
      if (onRequireAuth) onRequireAuth();
      return false;
    }
    if (callback) callback();
    return true;
  };

  // Handle Speech Recognition toggle
  const toggleSpeechRecognition = () => {
    if (!checkAuth()) return;

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setInterimTranscript('');
      const started = speechService.startListening({
        onStart: () => setIsListening(true),
        onResult: (res) => {
          if (res.final) {
            setText(prev => prev ? `${prev} ${res.final}` : res.final);
            setInterimTranscript('');
          } else {
            setInterimTranscript(res.interim);
          }
        },
        onEnd: () => setIsListening(false),
        onError: (err) => {
          console.warn('STT Error:', err);
          setIsListening(false);
        }
      });
      if (!started) {
        setIsListening(false);
      }
    }
  };

  const handleSend = () => {
    if (!checkAuth()) return;
    if (!text.trim() && !photoAttachment && !videoAttachment) return;

    onSendMessage({
      text: text.trim(),
      photo: photoAttachment,
      video: videoAttachment,
      isVoiceInput: isListening
    });

    // Reset inputs
    setText('');
    setPhotoAttachment(null);
    setVideoAttachment(null);
    setInterimTranscript('');
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e) => {
    if (!checkAuth()) return;
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) {
      setPhotoAttachment({ file, url, name: file.name });
    } else if (file.type.startsWith('video/')) {
      setVideoAttachment({ file, url, name: file.name });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--color-border)',
      padding: '12px 16px 20px',
      zIndex: 800
    }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', position: 'relative' }}>
        
        {/* Unauthenticated Access Gate Overlay Banner */}
        {!user && (
          <div style={{
            position: 'absolute',
            inset: '-6px -8px',
            backgroundColor: 'rgba(255, 246, 217, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--color-primary-yellow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            zIndex: 10,
            boxShadow: 'var(--shadow-gold)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={20} color="var(--color-text-charcoal)" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-charcoal)' }}>
                Log In Required to Chat with Bhavna AI
              </span>
            </div>
            <button
              onClick={onRequireAuth}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Log In / Sign Up
            </button>
          </div>
        )}

        {/* Real-time STT Transcript Overlay */}
        {(isListening || interimTranscript) && (
          <div style={{
            backgroundColor: 'var(--color-primary-yellow-light)',
            border: '1px solid var(--color-primary-yellow-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '10px',
            fontSize: '13px',
            color: 'var(--color-text-charcoal)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              animation: 'pulseGlow 1s infinite'
            }} />
            <span style={{ fontWeight: 600 }}>Listening...</span>
            <span style={{ fontStyle: 'italic', flex: 1, color: 'var(--color-text-secondary)' }}>
              {interimTranscript || 'Speak your message now...'}
            </span>
          </div>
        )}

        {/* Attachment Preview Chips */}
        {(photoAttachment || videoAttachment) && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {photoAttachment && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-bg-subtle)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                border: '1px solid var(--color-border)'
              }}>
                <img src={photoAttachment.url} alt="Thumbnail" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                <span style={{ fontWeight: 600 }}>{photoAttachment.name}</span>
                <button onClick={() => setPhotoAttachment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            {videoAttachment && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-bg-subtle)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                border: '1px solid var(--color-border)'
              }}>
                <Video size={16} color="#EC4899" />
                <span style={{ fontWeight: 600 }}>{videoAttachment.name}</span>
                <button onClick={() => setVideoAttachment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        {/* Input Bar Layout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--color-bg-white)',
          borderRadius: 'var(--radius-lg)',
          border: isListening ? '2px solid var(--color-primary-yellow)' : '1px solid var(--color-border)',
          padding: '6px 10px 6px 14px',
          boxShadow: 'var(--shadow-md)'
        }}>
          
          {/* Quick Modality Triggers (Photo / Video / File) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => checkAuth(onOpenPhotoModal)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                color: 'var(--color-text-secondary)',
                transition: 'background 0.15s ease'
              }}
              title="Take Photo or Upload Image"
            >
              <Camera size={20} color="#10B981" />
            </button>

            <button
              onClick={() => checkAuth(onStartVideoCall)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                color: 'var(--color-text-secondary)',
                transition: 'background 0.15s ease'
              }}
              title="Start Live AI Video Call"
            >
              <Video size={20} color="#EC4899" />
            </button>

            <button
              onClick={() => checkAuth(() => fileInputRef.current && fileInputRef.current.click())}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                color: 'var(--color-text-muted)'
              }}
              title="Attach File"
            >
              <Paperclip size={20} />
            </button>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => checkAuth()}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening to your voice..." : "Type a message or press mic to speak..."}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              padding: '8px 0',
              backgroundColor: 'transparent',
              color: 'var(--color-text-charcoal)',
              maxHeight: '120px'
            }}
          />

          {/* Microphone Central Button */}
          <button
            onClick={toggleSpeechRecognition}
            className={isListening ? 'animate-pulse-glow' : ''}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: isListening ? '#EF4444' : 'var(--color-primary-yellow)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isListening ? '#FFFFFF' : 'var(--color-text-charcoal)',
              boxShadow: isListening ? '0 0 12px rgba(239, 68, 68, 0.5)' : 'var(--shadow-gold)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            title={isListening ? "Stop Recording" : "Press to Speak"}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!text.trim() && !photoAttachment && !videoAttachment}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: (text.trim() || photoAttachment || videoAttachment) ? 'var(--color-text-charcoal)' : 'var(--color-bg-subtle)',
              color: (text.trim() || photoAttachment || videoAttachment) ? '#FFFFFF' : 'var(--color-text-muted)',
              border: 'none',
              cursor: (text.trim() || photoAttachment || videoAttachment) ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              flexShrink: 0
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
