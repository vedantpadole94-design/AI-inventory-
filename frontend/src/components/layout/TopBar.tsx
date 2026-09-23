import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, HelpCircle, LogOut, Settings as SettingsIcon, User, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../design-system/components/Avatar';
import { DropdownMenu } from '../../design-system/components/DropdownMenu';
import { mockActivityFeed } from '../../data/mockData';
import { Link, useNavigate } from 'react-router-dom';

export interface TopBarProps {
  onOpenCommandPalette: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  onToggleSidebar,
}) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const userSections = [
    {
      title: user?.email,
      items: [
        { id: 'profile', label: 'My Profile', icon: <User size={15} />, onClick: () => navigate('/settings') },
        { id: 'settings', label: 'Organization Settings', icon: <SettingsIcon size={15} />, onClick: () => navigate('/settings') },
      ],
    },
    {
      items: [
        { id: 'signout', label: 'Sign Out', icon: <LogOut size={15} />, danger: true, onClick: handleSignOut },
      ],
    },
  ];

  const helpSections = [
    {
      title: 'Resources',
      items: [
        { id: 'docs', label: 'Documentation & API', icon: <HelpCircle size={15} />, onClick: () => window.open('https://smartprocure.ai/docs', '_blank') },
        { id: 'shortcuts', label: 'Keyboard Shortcuts (⌘K)', icon: <Search size={15} />, onClick: onOpenCommandPalette },
        { id: 'design-system', label: 'Design System Showcase', icon: <SettingsIcon size={15} />, onClick: () => navigate('/design-system') },
      ],
    },
  ];

  return (
    <header className="h-[56px] bg-white border-b border-border-default px-[16px] sm:px-[24px] flex items-center justify-between sticky top-0 z-30 select-none">
      {/* LEFT: Mobile hamburger + Brand logo & wordmark */}
      <div className="flex items-center gap-[12px]">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden text-text-secondary hover:text-text-primary p-[6px] rounded-[6px] hover:bg-subtle"
          >
            <Menu size={20} />
          </button>
        )}
        <Link to="/dashboard" className="flex items-center gap-[10px] group">
          <div className="w-[32px] h-[32px] rounded-[8px] bg-accent-primary flex items-center justify-center text-white shadow-xs font-semibold text-[15px] tracking-tight">
            SP
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-text-primary tracking-tight leading-none group-hover:text-accent-primary transition-colors">
              SmartProcure AI
            </span>
            <span className="text-[10px] text-text-tertiary tracking-wider uppercase font-medium mt-[2px]">
              Enterprise Suite
            </span>
          </div>
        </Link>
      </div>

      {/* CENTER: Global search Cmd+K button */}
      <div className="flex-1 max-w-[440px] mx-[16px] hidden sm:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full h-[36px] px-[12px] rounded-[8px] bg-subtle border border-border-default text-text-secondary hover:bg-white hover:border-border-strong text-[13px] flex items-center justify-between shadow-xs transition-all duration-150"
        >
          <div className="flex items-center gap-[8px] text-text-tertiary">
            <Search size={15} />
            <span className="text-text-secondary">Search suppliers, orders, analytics...</span>
          </div>
          <kbd className="text-[11px] font-mono px-[6px] py-[1px] bg-white border border-border-default rounded-[4px] text-text-tertiary shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* RIGHT: Help, Notifications, User menu */}
      <div className="flex items-center gap-[8px]">
        {/* Help Dropdown */}
        <DropdownMenu
          trigger={
            <button className="w-[34px] h-[34px] rounded-[8px] text-text-secondary hover:text-text-primary hover:bg-subtle flex items-center justify-center transition-colors">
              <HelpCircle size={18} />
            </button>
          }
          sections={helpSections}
          align="right"
        />

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className="w-[34px] h-[34px] rounded-[8px] text-text-secondary hover:text-text-primary hover:bg-subtle flex items-center justify-center relative transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-semantic-danger rounded-full ring-2 ring-white" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 6 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 mt-[8px] w-[340px] bg-surface border border-border-default rounded-[12px] shadow-lg py-[8px] z-50 origin-top-right"
              >
                <div className="px-[16px] py-[8px] border-b border-border-default flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-text-primary">System Notifications</span>
                  <span className="text-[11px] text-text-tertiary">Real-time alerts</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y divide-border-default">
                  {mockActivityFeed.slice(0, 5).map((evt) => (
                    <div key={evt.id} className="p-[12px] px-[16px] hover:bg-subtle transition-colors">
                      <p className="text-[13px] font-medium text-text-primary leading-[18px]">{evt.title}</p>
                      <p className="text-[12px] text-text-secondary mt-[2px] leading-[16px] line-clamp-2">{evt.description}</p>
                      <span className="text-[11px] text-text-tertiary mt-[4px] block">{evt.timestamp}</span>
                    </div>
                  ))}
                </div>
                <div className="p-[8px] px-[16px] border-t border-border-default bg-subtle/50 text-center">
                  <Link
                    to="/risk"
                    onClick={() => setShowNotifications(false)}
                    className="text-[12px] font-medium text-accent-primary hover:underline"
                  >
                    View all alerts & risk monitoring →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-[20px] w-[1px] bg-border-default mx-[4px]" />

        {/* User avatar dropdown */}
        <DropdownMenu
          trigger={
            <div className="flex items-center gap-[8px] pl-[4px] py-[4px] rounded-[8px] hover:bg-subtle cursor-pointer transition-colors">
              <Avatar name={user?.name || 'Demo Evaluator'} size="sm" />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[13px] font-medium text-text-primary leading-tight">
                  {user?.name}
                </span>
                <span className="text-[11px] text-text-tertiary leading-tight">
                  {user?.role}
                </span>
              </div>
            </div>
          }
          sections={userSections}
          align="right"
        />
      </div>
    </header>
  );
};
