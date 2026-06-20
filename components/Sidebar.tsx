'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardSignature,
  ListTodo,
  Compass,
  Shield,
  Landmark,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { logout } from '../app/utils/api';

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Intake Wizard',
    href: '/intake',
    icon: ClipboardSignature,
  },
  {
    name: 'Action Plans',
    href: '/action-plans',
    icon: ListTodo,
  },
  {
    name: 'Resource Finder',
    href: '/resources',
    icon: Compass,
  },
  {
    name: 'Tenant Rights',
    href: '/rights',
    icon: Shield,
  },
  {
    name: 'Court Prep',
    href: '/court',
    icon: Landmark,
  },
  {
    name: 'Risk Profiler',
    href: '/risk',
    icon: TrendingUp,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setMobileOpen(false);
    try {
      await logout();
    } finally {
      router.push('/intake');
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 100,
          width: 44,
          height: 44,
          borderRadius: 8,
          border: '1px solid #D9DDE5',
          background: '#FFFFFF',
          display: 'none',
        }}
        className="sidebar-mobile-trigger"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 99,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 280,
          height: '100vh',
          background: '#FFFFFF',
          borderRight: '1px solid #D9DDE5',
          position: 'fixed',
          left: mobileOpen ? 0 : undefined,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 101,
        }}
        className={`sidebar-root ${mobileOpen ? 'sidebar-open' : ''}`}
      >
        {/* Header */}
        <div
          style={{
            height: 72,
            padding: '20px 24px',
            borderBottom: '1px solid #EEF1F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#072B84',
                margin: 0,
              }}
            >
              Stability AI
            </h1>

            <p
              style={{
                marginTop: 4,
                fontSize: 11,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Housing Support
            </p>
          </div>

          <button
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'none',
            }}
            className="sidebar-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: 16,
            overflowY: 'auto',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 48,
                  padding: '0 14px',
                  marginBottom: 6,
                  borderRadius: 8,
                  textDecoration: 'none',
                  background: isActive
                    ? '#E8F0FF'
                    : 'transparent',
                  color: isActive
                    ? '#072B84'
                    : '#4B5563',
                  borderLeft: isActive
                    ? '4px solid #072B84'
                    : '4px solid transparent',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <Icon
                  size={18}
                  style={{
                    marginRight: 12,
                    flexShrink: 0,
                  }}
                />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div
          style={{
            padding: 16,
            borderTop: '1px solid #EEF1F5',
          }}
        >
          <button
            style={{
              width: '100%',
              height: 44,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              color: '#4B5563',
              marginBottom: 6,
            }}
          >
            <Settings
              size={18}
              style={{ marginRight: 12 }}
            />
            Settings
          </button>

          <button
            id="sidebar-logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              width: '100%',
              height: 44,
              borderRadius: 8,
              border: 'none',
              background: isLoggingOut ? '#FEF2F2' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              color: isLoggingOut ? '#9CA3AF' : '#DC2626',
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              transition: 'background 0.15s',
              opacity: isLoggingOut ? 0.7 : 1,
            }}
          >
            <LogOut
              size={18}
              style={{ marginRight: 12, flexShrink: 0 }}
            />
            {isLoggingOut ? 'Signing out...' : 'Log Out'}
          </button>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 1024px) {
          .sidebar-mobile-trigger {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }

          .sidebar-root {
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }

          .sidebar-root.sidebar-open {
            transform: translateX(0);
          }

          .sidebar-close-btn {
            display: block !important;
            border: none;
            background: transparent;
            cursor: pointer;
          }
        }
      `}</style>
    </>
  );
}