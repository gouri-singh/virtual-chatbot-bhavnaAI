import React, { useState } from 'react';
import { Plus, MessageSquare, Mic, Camera, Video, Settings, LogOut, Search, User, Trash2, ChevronRight, X } from 'lucide-react';
import BhavnaAvatar from '../Avatar/BhavnaAvatar';

export default function Sidebar({
  isOpen,
  onClose,
  onNewChat,
  chatHistory,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  user,
  onOpenAuth,
  onOpenSettings,
  onLogout
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = chatHistory.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 900
          }}
        />
      )}

      <aside style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        width: '300px',
        backgroundColor: 'var(--color-bg-white)',
        borderRight: '1px solid var(--color-border)',
        zIndex: 950,
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        boxShadow: isOpen ? 'var(--shadow-lg)' : 'none'
      }}>
        {/* Top Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BhavnaAvatar state="idle" size="small" />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-charcoal)', lineHeight: 1.2 }}>
                Bhavna AI
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--color-primary-yellow-hover)', fontWeight: 600 }}>
                Multimodal Assistant
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action: New Chat */}
        <div style={{ padding: '16px 20px' }}>
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '15px' }}
          >
            <Plus size={20} /> New Conversation
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '0 20px 12px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '36px', fontSize: '13px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          </div>
        </div>

        {/* Chat History List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', padding: '8px 12px' }}>
            Recent Chats ({filteredHistory.length})
          </div>

          {filteredHistory.length === 0 ? (
            <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              No history found
            </div>
          ) : (
            filteredHistory.map(chat => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => { onSelectChat(chat.id); onClose(); }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? 'var(--color-primary-yellow-light)' : 'transparent',
                    border: isActive ? '1px solid var(--color-primary-yellow-border)' : '1px solid transparent',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    group: 'history-item'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: isActive ? 700 : 600, color: 'var(--color-text-charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {chat.title}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {chat.snippet}
                    </p>

                    {/* Modality Badges */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      {chat.modes.includes('text') && <MessageSquare size={12} color="var(--color-text-muted)" />}
                      {chat.modes.includes('voice') && <Mic size={12} color="#3B82F6" />}
                      {chat.modes.includes('photo') && <Camera size={12} color="#10B981" />}
                      {chat.modes.includes('video') && <Video size={12} color="#EC4899" />}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      padding: '4px',
                      borderRadius: '4px'
                    }}
                    title="Delete Chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* User Profile & Menu Footer */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-soft)'
        }}>
          {user ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary-yellow)' }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.identifier}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { onOpenSettings(); onClose(); }}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                >
                  <Settings size={14} /> Settings
                </button>
                <button
                  onClick={onLogout}
                  className="btn-secondary"
                  style={{ color: 'var(--color-error)', borderColor: '#FCA5A5', padding: '8px', fontSize: '12px' }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { onOpenAuth(); onClose(); }}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '14px' }}
            >
              <User size={16} /> Log In / Sign Up
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
