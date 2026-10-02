import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, RefreshCw, Check, Upload, AlertCircle } from 'lucide-react';

export default function CameraModal({ isOpen, onClose, onCapturePhoto }) {
  const [stream, setStream] = useState(null);
  const [capturedUrl, setCapturedUrl] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen && !capturedUrl) {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => stopWebcam();
  }, [isOpen, capturedUrl]);

  const startWebcam = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Webcam access unavailable. You can upload a photo or use demo capture.');
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current && stream) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedUrl(dataUrl);
      stopWebcam();
    } else {
      // Demo snapshot fallback
      const demoUrl = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80';
      setCapturedUrl(demoUrl);
    }
  };

  const handleConfirm = () => {
    if (capturedUrl) {
      onCapturePhoto({
        url: capturedUrl,
        name: `Captured_Photo_${Date.now().toString().slice(-4)}.jpg`
      });
      onClose();
      setCapturedUrl(null);
    }
  };

  const handleRetake = () => {
    setCapturedUrl(null);
    startWebcam();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
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
        maxWidth: '560px',
        padding: '24px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-charcoal)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera color="#10B981" /> Photo Query Capture
          </h3>
          <button onClick={() => { stopWebcam(); onClose(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Viewport */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '320px',
          backgroundColor: '#000000',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          {capturedUrl ? (
            <img src={capturedUrl} alt="Snapshot" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : cameraError ? (
            <div style={{ textAlign: 'center', color: '#FFFFFF', padding: '20px' }}>
              <AlertCircle size={36} color="#F2B705" style={{ marginBottom: '10px' }} />
              <p style={{ fontSize: '14px', marginBottom: '12px' }}>{cameraError}</p>
              <button onClick={takeSnapshot} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                Use Demo Photo Snapshot
              </button>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {capturedUrl ? (
            <>
              <button onClick={handleRetake} className="btn-secondary" style={{ flex: 1 }}>
                <RefreshCw size={18} /> Retake
              </button>
              <button onClick={handleConfirm} className="btn-primary" style={{ flex: 1 }}>
                <Check size={18} /> Attach Photo
              </button>
            </>
          ) : (
            <button onClick={takeSnapshot} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px' }}>
              <Camera size={20} /> Capture Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
