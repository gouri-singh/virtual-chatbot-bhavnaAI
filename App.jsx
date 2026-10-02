import React, { useState, useEffect } from 'react';
import { Menu, Plus, Settings, User, Sparkles, Volume2, Mic, Camera, Video, Sun, Moon } from 'lucide-react';
import Sidebar from './components/Layout/Sidebar';
import SettingsModal from './components/Layout/SettingsModal';
import AuthModal from './components/Auth/AuthModal';
import OnboardingTour from './components/Auth/OnboardingTour';
import ChatFeed from './components/Chat/ChatFeed';
import InputBar from './components/Chat/InputBar';
import CameraModal from './components/Modals/CameraModal';
import VideoCallModal from './components/Modals/VideoCallModal';
import PhotoLightbox from './components/Modals/PhotoLightbox';
import BhavnaAvatar from './components/Avatar/BhavnaAvatar';
import { AIService } from './services/aiService';
import { speechService } from './services/speechService';

const INITIAL_DEMO_CHATS = [
  {
    id: 'chat-1',
    title: 'Welcome to Bhavna AI',
    snippet: 'Empathetic multimodal conversation',
    modes: ['text', 'voice'],
    messages: [
      {
        id: 'msg-1',
        sender: 'ai',
        text: "Welcome to **Bhavna AI**! 💛 I'm your multimodal assistant. You can speak to me with voice, type text, or upload photos and videos anytime!",
        timestamp: '10:00 AM'
      }
    ]
  }
];

export default function App() {
  // State: Authentication & User
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bhavna_user');
    return saved ? JSON.parse(saved) : null;
  });

  // State: Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('bhavna_settings');
    return saved ? JSON.parse(saved) : {
      voiceGender: 'female',
      speechRate: 1.0,
      theme: 'light',
      autoSpeak: true
    };
  });

  // State: Chat Threads & History
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('bhavna_chats');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_CHATS;
  });
  const [activeChatId, setActiveChatId] = useState('chat-1');

  // UI Modals - Auto-open AuthModal if user is unauthenticated
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(() => !user);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [lightboxPhotoUrl, setLightboxPhotoUrl] = useState(null);

  // Active AI Processing States
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);

  // Sync theme attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    localStorage.setItem('bhavna_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist chat history
  useEffect(() => {
    localStorage.setItem('bhavna_chats', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const activeChat = chatHistory.find(c => c.id === activeChatId) || chatHistory[0];
  const messages = activeChat ? activeChat.messages : [];

  // Authentication Helper Gate
  const requireAuth = (action) => {
    if (!user) {
      setIsAuthOpen(true);
      return false;
    }
    if (action) action();
    return true;
  };

  // Update Settings
  const handleUpdateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Auth Callbacks
  const handleLoginSuccess = (userData, triggerOnboarding = false) => {
    setUser(userData);
    setIsAuthOpen(false);
    if (triggerOnboarding) {
      setIsOnboardingOpen(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bhavna_user');
    setIsAuthOpen(true); // Re-prompt login on logout
  };

  // Chat Actions
  const handleNewChat = () => {
    requireAuth(() => {
      const newId = `chat-${Date.now()}`;
      const newChat = {
        id: newId,
        title: 'New Conversation',
        snippet: 'Started just now',
        modes: ['text'],
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'ai',
            text: "Hello! I'm Bhavna AI. What's on your mind today? Feel free to speak, type, or attach photos/videos!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      setChatHistory(prev => [newChat, ...prev]);
      setActiveChatId(newId);
    });
  };

  const handleDeleteChat = (idToDelete) => {
    requireAuth(() => {
      const updated = chatHistory.filter(c => c.id !== idToDelete);
      setChatHistory(updated);
      if (activeChatId === idToDelete && updated.length > 0) {
        setActiveChatId(updated[0].id);
      }
    });
  };

  const handleClearAllData = () => {
    requireAuth(() => {
      setChatHistory([]);
      localStorage.removeItem('bhavna_chats');
      handleNewChat();
      setIsSettingsOpen(false);
    });
  };

  // Audio Playback
  const handlePlayAudio = (msg) => {
    if (currentlyPlayingId === msg.id) {
      speechService.stop();
      setCurrentlyPlayingId(null);
    } else {
      setCurrentlyPlayingId(msg.id);
      speechService.speak(msg.text, {
        gender: settings.voiceGender,
        rate: settings.speechRate,
        onEnd: () => setCurrentlyPlayingId(null),
        onError: () => setCurrentlyPlayingId(null)
      });
    }
  };

  // Multimodal Message Dispatcher
  const handleSendMessage = async (payload) => {
    if (!requireAuth()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `msg-${Date.now()}`;

    // Determine input modes used
    const modesUsed = ['text'];
    if (payload.isVoiceInput) modesUsed.push('voice');
    if (payload.photo) modesUsed.push('photo');
    if (payload.video) modesUsed.push('video');

    const userMessage = {
      id: userMsgId,
      sender: 'user',
      text: payload.text,
      photo: payload.photo,
      video: payload.video,
      timestamp: timeStr
    };

    // Update active chat title & messages
    setChatHistory(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        const title = chat.title === 'New Conversation' ? (payload.text.slice(0, 24) || 'Visual Query') : chat.title;
        return {
          ...chat,
          title,
          snippet: payload.text || 'Shared visual media',
          modes: Array.from(new Set([...chat.modes, ...modesUsed])),
          messages: [...chat.messages, userMessage]
        };
      }
      return chat;
    }));

    // Trigger AI thinking state
    setIsThinking(true);

    try {
      const aiText = await AIService.generateResponse(payload);
      const aiMsgId = `msg-ai-${Date.now()}`;
      const aiMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, aiMessage]
          };
        }
        return chat;
      }));

      // Auto-speak response if enabled
      if (settings.autoSpeak) {
        setCurrentlyPlayingId(aiMsgId);
        speechService.speak(aiText, {
          gender: settings.voiceGender,
          rate: settings.speechRate,
          onEnd: () => setCurrentlyPlayingId(null),
          onError: () => setCurrentlyPlayingId(null)
        });
      }
    } catch (err) {
      console.error('AI Error:', err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* Navbar Header */}
      <header className="glass-panel" style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)',
        zIndex: 500
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-charcoal)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)'
            }}
            title="Open Menu"
          >
            <Menu size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BhavnaAvatar state={isThinking ? 'thinking' : isListening ? 'listening' : currentlyPlayingId ? 'speaking' : 'idle'} size="small" />
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-charcoal)', lineHeight: 1.1 }}>
                Bhavna AI
              </h1>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {activeChat ? activeChat.title : 'Chat'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Bar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick Voice Gender Switcher Pill */}
          <button
            onClick={() => handleUpdateSettings({ voiceGender: settings.voiceGender === 'female' ? 'male' : 'female' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: settings.voiceGender === 'female' ? '#FDF2F8' : '#EFF6FF',
              border: settings.voiceGender === 'female' ? '1px solid #FBCFE8' : '1px solid #BFDBFE',
              color: settings.voiceGender === 'female' ? '#DB2777' : '#2563EB',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="Toggle Voice Gender"
          >
            <Volume2 size={14} />
            {settings.voiceGender === 'female' ? '👩 Female ♀' : '👨 Male ♂'}
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={() => handleUpdateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--color-text-secondary)'
            }}
            title="Toggle Theme"
          >
            {settings.theme === 'light' ? <Moon size={20} color="#F2B705" /> : <Sun size={20} color="#F2B705" />}
          </button>

          {/* User Account Button */}
          {user ? (
            <div 
              onClick={() => setIsSettingsOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--color-primary-yellow)', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              <User size={14} /> Log In
            </button>
          )}
        </div>
      </header>

      {/* Main Chat Feed Area */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ChatFeed
          messages={messages}
          isThinking={isThinking}
          onPlayAudio={handlePlayAudio}
          currentlyPlayingId={currentlyPlayingId}
          user={user}
          voiceGender={settings.voiceGender}
          onOpenPhotoLightbox={(url) => setLightboxPhotoUrl(url)}
        />

        <InputBar
          onSendMessage={handleSendMessage}
          onOpenPhotoModal={() => requireAuth(() => setIsCameraOpen(true))}
          onOpenVideoModal={() => requireAuth(() => setIsVideoCallOpen(true))}
          onStartVideoCall={() => requireAuth(() => setIsVideoCallOpen(true))}
          isListening={isListening}
          setIsListening={setIsListening}
          user={user}
          onRequireAuth={() => setIsAuthOpen(true)}
        />
      </main>

      {/* Modals & Drawers */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onSelectChat={(id) => requireAuth(() => setActiveChatId(id))}
        onDeleteChat={handleDeleteChat}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSettings={() => requireAuth(() => setIsSettingsOpen(true))}
        onLogout={handleLogout}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={user ? () => setIsAuthOpen(false) : undefined}
        onLoginSuccess={handleLoginSuccess}
      />

      <OnboardingTour
        isOpen={isOnboardingOpen}
        onComplete={() => setIsOnboardingOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClearData={handleClearAllData}
      />

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapturePhoto={(photoData) => handleSendMessage({ photo: photoData, text: 'Analyze this photo query for me.' })}
      />

      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        voiceGender={settings.voiceGender}
      />

      <PhotoLightbox
        photoUrl={lightboxPhotoUrl}
        onClose={() => setLightboxPhotoUrl(null)}
      />
    </div>
  );
}
