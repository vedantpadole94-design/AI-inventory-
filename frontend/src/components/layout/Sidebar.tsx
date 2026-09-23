import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Building2,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Settings,
  Palette,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../design-system/utils';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../design-system/components/Avatar';
import { ease, durations } from '../../lib/motion/presets';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user } = useAuthStore();

  const navGroups = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} />, accent: '#4F46E5' },
        { label: 'Suppliers', path: '/suppliers', icon: <Users size={18} />, accent: '#059669' },
        { label: 'Purchase Orders', path: '/orders', icon: <ShoppingCart size={18} />, accent: '#2563EB' },
        { label: 'Inventory', path: '/inventory', icon: <Package size={18} />, accent: '#D97706' },
        { label: 'Customers', path: '/customers', icon: <Building2 size={18} />, accent: '#DB2777' },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={18} />, accent: '#0D9488' },
        { label: 'Forecasting', path: '/forecasting', icon: <TrendingUp size={18} />, accent: '#7C3AED' },
        { label: 'Risk Assessment', path: '/risk', icon: <AlertTriangle size={18} />, accent: '#E11D48' },
        { label: 'AI Copilot', path: '/copilot', icon: <Sparkles size={18} />, accent: '#6366F1' },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/settings', icon: <Settings size={18} />, accent: '#475569' },
        { label: 'Design System', path: '/design-system', icon: <Palette size={18} />, accent: '#4F46E5' },
      ],
    },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: durations.normal, ease: ease.out }}
      className="bg-surface/95 backdrop-blur-md border-r border-border-default flex flex-col justify-between select-none z-20 shrink-0 sticky top-[56px] h-[calc(100vh-56px)]"
    >
      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-[16px] px-[8px] space-y-[20px]">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-[4px]">
            {!isCollapsed && (
              <div className="px-[12px] py-[4px] text-[11px] font-semibold text-text-tertiary tracking-wider uppercase">
                {group.title}
              </div>
            )}
            <div className="space-y-[2px]">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-[10px] px-[12px] py-[8px] rounded-[8px] text-[13px] font-medium transition-colors relative group',
                      isActive
                        ? 'font-semibold text-text-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-subtle/80',
                      isCollapsed && 'justify-center px-0'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="sidebarActivePill"
                          className="absolute inset-0 rounded-[8px] -z-0 border border-border-default/40 shadow-xs"
                          style={{ backgroundColor: `${item.accent}12` }}
                          transition={{ duration: durations.fast, ease: ease.out }}
                        />
                      )}
                      <span
                        className={cn('shrink-0 relative z-10 transition-colors', isCollapsed && 'mx-auto')}
                        style={isActive ? { color: item.accent } : undefined}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span
                          className="relative z-10 transition-colors truncate"
                          style={isActive ? { color: item.accent, fontWeight: 600 } : undefined}
                        >
                          {item.label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Plan card, User info, Collapse button */}
      <div className="p-[12px] border-t border-border-default space-y-[10px] bg-subtle/30">
        {!isCollapsed && (
          <div className="p-[12px] rounded-[10px] bg-accent-subtle/60 border border-accent-light/50 flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-accent-primary flex items-center gap-[4px]">
                <ShieldCheck size={14} /> Enterprise Pro
              </span>
              <span className="text-[10px] font-medium px-[6px] py-[1px] bg-white text-accent-primary border border-accent-light rounded-full shadow-xs">
                Active
              </span>
            </div>
            <div className="w-full bg-accent-light/40 h-[4px] rounded-full overflow-hidden">
              <div className="bg-accent-primary h-full rounded-full w-[80%]" />
            </div>
            <span className="text-[11px] text-text-tertiary">8 / 10 seats provisioned</span>
          </div>
        )}

        <div className={cn('flex items-center justify-between', isCollapsed && 'justify-center')}>
          {!isCollapsed && (
            <div className="flex items-center gap-[8px] overflow-hidden">
              <Avatar name={user?.name || 'Demo'} size="sm" />
              <div className="flex flex-col truncate">
                <span className="text-[12px] font-medium text-text-primary truncate">{user?.name}</span>
                <span className="text-[11px] text-text-tertiary truncate">{user?.role}</span>
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-[28px] h-[28px] rounded-[6px] border border-border-default bg-surface text-text-tertiary hover:text-text-primary hover:bg-subtle flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};
