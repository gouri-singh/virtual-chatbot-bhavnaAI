import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Camera, VideoOff, Sparkles, Volume2, Maximize2 } from 'lucide-react';
import BhavnaAvatar from '../Avatar/BhavnaAvatar';
import { speechService } from '../../services/speechService';
import { AIService } from '../../services/aiService';

export default function VideoCallModal({ isOpen, onClose, voiceGender = 'female' }) {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [callState, setCallState] = useState('connected'); // 'connecting' | 'connected' | 'speaking' | 'listening'
  const [transcript, setTranscript] = useState('Bhavna AI Video Call Active');
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
      // Greet user on call connect
      const greeting = voiceGender === 'female'
        ? "Hello! I'm Bhavna. It's wonderful to see you on video!"
        : "Hey there! Bhavna AI here. Great to connect with you live!";
      
      setCallState('speaking');
      speechService.speak(greeting, {
        gender: voiceGender,
        onEnd: () => setCallState('connected')
      });
    } else {
      stopCamera();
      speechService.stop();
    }
    return () => stopCamera();
  }, [isOpen, voiceGender]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.warn('Video call camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleSpeakToAI = () => {
    if (isMicMuted) return;
    setCallState('listening');
    setTranscript('Listening to your spoken query...');

    speechService.startListening({
      onResult: async (res) => {
        if (res.final) {
          setTranscript(`You: "${res.final}"`);
          setCallState('thinking');
          const aiResponse = await AIService.generateResponse({ text: res.final, isVoiceInput: true });
          
          setTranscript(`Bhavna: ${aiResponse}`);
          setCallState('speaking');
          speechService.speak(aiResponse, {
            gender: voiceGender,
            onEnd: () => setCallState('connected')
          });
        }
      },
      onError: () => setCallState('connected')
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0F172A',
      zIndex: 1100,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Bar */}
      <div style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles color="#F2B705" size={24} />
          <div>
            <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, margin: 0 }}>
              Live AI Video Session
            </h3>
            <span style={{ color: '#10B981', fontSize: '12px', fontWeight: 600 }}>● HD Connected</span>
          </div>
        </div>

        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px' }}>
          Bhavna AI ({voiceGender === 'female' ? '👩 Female Voice' : '👨 Male Voice'})
        </div>
      </div>

      {/* Main Video Screen Area */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        {/* Bhavna AI Live Animated Presence Avatar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          <BhavnaAvatar state={callState === 'speaking' ? 'speaking' : callState === 'listening' ? 'listening' : callState === 'thinking' ? 'thinking' : 'idle'} size="large" />

          <div style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '16px 24px',
            maxWidth: '540px',
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            {transcript}
          </div>
        </div>

        {/* User Webcam Self-View Box */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          width: '180px',
          height: '240px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#1E293B',
          border: '2px solid rgba(242, 183, 5, 0.6)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
        }}>
          {!isCamOff && stream ? (
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
              <Camera size={32} />
            </div>
          )}
          <span style={{ position: 'absolute', bottom: '8px', left: '8px', fontSize: '11px', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
            You
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)'
      }}>
        <button
          onClick={() => setIsMicMuted(!isMicMuted)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: isMicMuted ? '#EF4444' : 'rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {isMicMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <button
          onClick={handleSpeakToAI}
          className="btn-primary"
          style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '30px' }}
        >
          <Mic size={20} /> Speak to Bhavna
        </button>

        <button
          onClick={() => setIsCamOff(!isCamOff)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: isCamOff ? '#EF4444' : 'rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isCamOff ? "Turn Cam On" : "Turn Cam Off"}
        >
          {isCamOff ? <VideoOff size={24} /> : <Camera size={24} />}
        </button>

        <button
          onClick={() => { stopCamera(); speechService.stop(); onClose(); }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(220, 38, 38, 0.5)'
          }}
          title="End Video Call"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}
