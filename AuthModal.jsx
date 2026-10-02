import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Phone, Lock, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2, Sparkles, X } from 'lucide-react';
import BhavnaLogo from '../Avatar/BhavnaLogo';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot_password'
  const [step, setStep] = useState(1); // Sign up / Forgot password steps
  
  // Form fields
  const [identifier, setIdentifier] = useState(''); // Mobile or Email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  
  // Timer & UI states
  const [cooldown, setCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Auto detect Mobile vs Email
  const isEmail = identifier.includes('@') || /^[a-zA-Z]/.test(identifier);
  const inputTypeLabel = isEmail ? 'Email Address' : 'Mobile Number';

  // OTP Cooldown timer
  useEffect(() => {
    let timer;
    if (mode === 'signup' && step === 2 && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    } else if (cooldown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [mode, step, cooldown]);

  if (!isOpen) return null;

  // Password strength check
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strengthScore = getPasswordStrength(password);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter your mobile number/email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Demo validation (accepts user inputs or demo credentials)
      const user = {
        name: name || (isEmail ? identifier.split('@')[0] : 'User'),
        identifier: identifier,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      localStorage.setItem('bhavna_user', JSON.stringify(user));
      onLoginSuccess(user);
    }, 1000);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg(`Please enter a valid ${inputTypeLabel.toLowerCase()}`);
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setCooldown(30);
      setCanResend(false);
    }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Go to password setup
    }, 800);
  };

  const handleCompleteSignUp = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user = {
        name: name.trim() || 'New User',
        identifier: identifier,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      localStorage.setItem('bhavna_user', JSON.stringify(user));
      onLoginSuccess(user, true); // true = trigger onboarding tour
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      const user = {
        name: 'Alex Morgan',
        identifier: 'alex.morgan@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      localStorage.setItem('bhavna_user', JSON.stringify(user));
      onLoginSuccess(user);
    }, 1200);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--color-bg-white)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '440px',
        padding: '32px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        position: 'relative'
      }}>
        {onClose && (
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)'
            }}
          >
            <X size={20} />
          </button>
        )}

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-yellow-light)',
            border: '2px solid var(--color-primary-yellow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: 'var(--shadow-gold)'
          }}>
            <BhavnaLogo size={34} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-charcoal)' }}>
            Bhavna AI
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {mode === 'login' && 'Welcome back! Sign in to continue speaking with Bhavna.'}
            {mode === 'signup' && 'Create your account to start voice & visual chats.'}
            {mode === 'forgot_password' && 'Reset your account password via OTP.'}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            marginBottom: '16px',
            border: '1px solid #FCA5A5'
          }}>
            {errorMsg}
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Mobile Number or Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. +1 234 567 8900 or alex@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <div style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }}>
                  {isEmail ? <Mail size={18} /> : <Phone size={18} />}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Password</label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot_password'); setStep(1); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary-yellow-hover)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                />
                <div style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }}>
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }}
            >
              {loading ? 'Authenticating...' : 'Log In'}
            </button>

            <div style={{ margin: '20px 0', textAlign: 'center', position: 'relative' }}>
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
              <span style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--color-bg-white)',
                padding: '0 12px',
                fontSize: '12px',
                color: 'var(--color-text-muted)'
              }}>
                OR
              </span>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              style={{ width: '100%', padding: '11px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {googleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setStep(1); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary-yellow-hover)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* MODE: SIGN UP */}
        {mode === 'signup' && (
          <div>
            {/* Step indicators */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: i <= step ? 'var(--color-primary-yellow)' : 'var(--color-border)'
                }} />
              ))}
            </div>

            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Mobile Number or Email
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter mobile number or email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px' }}>
                  {loading ? 'Sending Verification...' : 'Send OTP'} <ArrowRight size={18} />
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <p style={{ fontSize: '13px', textAlign: 'center', marginBottom: '16px', color: 'var(--color-text-secondary)' }}>
                  We sent a 6-digit OTP code to <strong>{identifier}</strong>
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      style={{
                        width: '44px',
                        height: '48px',
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-white)'
                      }}
                    />
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '13px' }}>
                  {cooldown > 0 ? (
                    <span style={{ color: 'var(--color-text-muted)' }}>Resend OTP in 00:{cooldown < 10 ? `0${cooldown}` : cooldown}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      style={{ background: 'none', border: 'none', color: 'var(--color-primary-yellow-hover)', fontWeight: 600, cursor: 'pointer' }}
                    >
                      <RefreshCw size={14} style={{ display: 'inline', marginRight: '4px' }} /> Resend OTP
                    </button>
                  )}
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px' }}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleCompleteSignUp}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Create Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-field"
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1, 2, 3, 4].map(s => (
                        <div key={s} style={{
                          flex: 1,
                          height: '4px',
                          borderRadius: '2px',
                          backgroundColor: s <= strengthScore ? (strengthScore >= 3 ? 'var(--color-success)' : 'var(--color-warning)') : 'var(--color-border)'
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Strength: {strengthScore <= 1 ? 'Weak' : strengthScore === 2 ? 'Medium' : strengthScore === 3 ? 'Good' : 'Strong!'} (Min 8 chars, 1 number & 1 special char)
                    </span>
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px' }}>
                  {loading ? 'Creating Account...' : 'Complete Account Setup'}
                </button>
              </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary-yellow-hover)', fontWeight: 700, cursor: 'pointer' }}
              >
                Log In
              </button>
            </div>
          </div>
        )}

        {/* MODE: FORGOT PASSWORD */}
        {mode === 'forgot_password' && (
          <form onSubmit={handleSendOtp}>
            <p style={{ fontSize: '13px', marginBottom: '16px', color: 'var(--color-text-secondary)' }}>
              Enter your registered mobile number or email address to receive an OTP code to reset your password.
            </p>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Mobile number or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              Send Reset Code
            </button>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontSize: '13px', cursor: 'pointer' }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
