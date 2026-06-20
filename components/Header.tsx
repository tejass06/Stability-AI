'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, LogOut, ChevronDown, Shield, Settings } from 'lucide-react';
import { logout, getSessionId } from '../app/utils/api';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load session ID for display
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setDropdownOpen(false);
    // Fire API call in background — do not await it
    logout().catch(() => {});
    // Redirect immediately — don't wait for network
    router.push('/intake');
  };

  // Shorten sessionId for display: show first 8 chars
  const shortSession = sessionId ? `#${sessionId.slice(0, 8).toUpperCase()}` : 'Anonymous';

  return (
    <header
      style={{
        height: '72px',
        background: '#FFFFFF',
        borderBottom: '1px solid #D9DDE5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Left Side */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#072B84',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <span style={{ fontSize: '12px', color: '#6B7280', marginTop: 2 }}>
            {subtitle}
          </span>
        )}
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Search Box */}
        <div style={{ position: 'relative', width: '260px' }} className="header-search">
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF',
            }}
          />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            style={{
              width: '100%',
              height: '40px',
              border: '1px solid #D9DDE5',
              borderRadius: '6px',
              paddingLeft: '36px',
              paddingRight: '12px',
              fontSize: '14px',
              background: '#FFFFFF',
              color: '#111827',
            }}
          />
        </div>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: '1px solid #D9DDE5',
            background: '#FFFFFF',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Bell size={18} color="#6B7280" />
          <span
            style={{
              position: 'absolute',
              top: '9px',
              right: '10px',
              width: '8px',
              height: '8px',
              borderRadius: '999px',
              background: '#EF4444',
            }}
          />
        </button>

        {/* User Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            id="user-menu-button"
            aria-label="User Menu"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: dropdownOpen ? '#F0F4FF' : '#FFFFFF',
              border: `1px solid ${dropdownOpen ? '#072B84' : '#D9DDE5'}`,
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '999px',
                background: '#072B84',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <User size={16} />
            </div>

            {/* Name + role */}
            <div style={{ textAlign: 'left' }} className="header-user-info">
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                Tenant
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>
                {shortSession}
              </div>
            </div>

            <ChevronDown
              size={14}
              color="#6B7280"
              className="header-user-info"
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: '#FFFFFF',
                border: '1px solid #D9DDE5',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                minWidth: '220px',
                zIndex: 100,
                overflow: 'hidden',
                animation: 'fadeSlideDown 0.15s ease',
              }}
            >
              {/* Session Info Header */}
              <div
                style={{
                  padding: '12px 16px',
                  background: '#F8FAFF',
                  borderBottom: '1px solid #EEF1F5',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={14} color="#072B84" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#072B84', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Active Session
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', fontFamily: 'monospace' }}>
                  {sessionId ? sessionId.slice(0, 20) + '...' : 'No active session'}
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '6px' }}>
                <button
                  role="menuitem"
                  onClick={() => { setDropdownOpen(false); router.push('/intake'); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    border: 'none',
                    background: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F3F4F6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <Settings size={15} color="#6B7280" />
                  Re-take Assessment
                </button>

                {/* Divider */}
                <div style={{ height: '1px', background: '#EEF1F5', margin: '4px 0' }} />

                {/* Logout Button */}
                <button
                  id="logout-button"
                  role="menuitem"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    border: 'none',
                    background: 'none',
                    borderRadius: '6px',
                    cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    color: isLoggingOut ? '#9CA3AF' : '#DC2626',
                    fontWeight: 600,
                    textAlign: 'left',
                    opacity: isLoggingOut ? 0.6 : 1,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!isLoggingOut) e.currentTarget.style.background = '#FEF2F2'; }}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut size={15} color={isLoggingOut ? '#9CA3AF' : '#DC2626'} />
                  {isLoggingOut ? 'Signing out...' : 'Log Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          header {
            padding-left: 72px !important;
          }
          .header-search {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .header-user-info {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}