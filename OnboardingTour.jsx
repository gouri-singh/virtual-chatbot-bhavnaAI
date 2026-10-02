import React, { useState } from 'react';
import { MessageSquare, Mic, Camera, Video, Sparkles, Check, ArrowRight } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: 'Welcome to Bhavna AI 💛',
    description: 'Your emotionally aware assistant. Bhavna ("emotion") communicates fluently across speaking, texting, photos, and live video.',
    icon: Sparkles,
    color: '#F2B705'
  },
  {
    title: 'Dual-Side Voice Dialogue 🎙️',
    description: 'Tap or press the central microphone button to speak naturally. Bhavna responds with spoken audio in your choice of Male ♂ or Female ♀ voices!',
    icon: Mic,
    color: '#3B82F6'
  },
  {
    title: 'Multimodal Photo Understanding 📷',
    description: 'Upload or capture a photo directly from your camera. Ask questions about objects, read text, or inquire about scene details.',
    icon: Camera,
    color: '#10B981'
  },
  {
    title: 'Live Video & Clip Analysis 🎥',
    description: 'Send short video clips or launch real-time video calls to converse face-to-face with Bhavna AI in real time.',
    icon: Video,
    color: '#EC4899'
  }
];

export default function OnboardingTour({ isOpen, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const IconComponent = step.icon;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--color-bg-white)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '460px',
        padding: '36px',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
          {TOUR_STEPS.map((_, idx) => (
            <div key={idx} style={{
              width: idx === currentStep ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: idx === currentStep ? 'var(--color-primary-yellow)' : 'var(--color-border)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>

        {/* Dynamic Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-yellow-light)',
          border: `2px solid ${step.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
        }}>
          <IconComponent size={36} color={step.color} />
        </div>

        <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px', color: 'var(--color-text-charcoal)' }}>
          {step.title}
        </h3>

        <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '32px' }}>
          {step.description}
        </p>

        <button
          onClick={handleNext}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '16px' }}
        >
          {currentStep === TOUR_STEPS.length - 1 ? (
            <>Get Started <Check size={20} /></>
          ) : (
            <>Next Feature <ArrowRight size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
}
