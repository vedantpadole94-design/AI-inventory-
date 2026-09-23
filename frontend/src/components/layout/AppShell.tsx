import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { CommandPalette, CommandItem } from '../../design-system/components/CommandPalette';
import PageTransition from '../common/PageTransition';
import { ScrollProgress } from '../../design-system/motion/ScrollProgress';
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
  PlusCircle,
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const commandItems: CommandItem[] = [
    { id: 'dash', title: 'Dashboard Overview', category: 'Navigation', path: '/dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'supp', title: 'Suppliers Directory', category: 'Navigation', path: '/suppliers', icon: <Users size={15} /> },
    { id: 'orders', title: 'Purchase Orders', category: 'Navigation', path: '/orders', icon: <ShoppingCart size={15} /> },
    { id: 'inv', title: 'Inventory & 3D Twin', category: 'Navigation', path: '/inventory', icon: <Package size={15} /> },
    { id: 'cust', title: 'Customers & Accounts', category: 'Navigation', path: '/customers', icon: <Building2 size={15} /> },
    { id: 'analytics', title: 'Spend & Analytics', category: 'Navigation', path: '/analytics', icon: <BarChart3 size={15} /> },
    { id: 'forecast', title: 'Commodity Forecasting', category: 'Navigation', path: '/forecasting', icon: <TrendingUp size={15} /> },
    { id: 'risk', title: 'Risk Assessment Matrix', category: 'Navigation', path: '/risk', icon: <AlertTriangle size={15} /> },
    { id: 'copilot', title: 'AI Procurement Copilot', category: 'Navigation', path: '/copilot', icon: <Sparkles size={15} /> },
    { id: 'settings', title: 'System & Organization Settings', category: 'Navigation', path: '/settings', icon: <Settings size={15} /> },
    { id: 'ds', title: 'Design System Primitives Showcase', category: 'Navigation', path: '/design-system', icon: <Palette size={15} /> },
    {
      id: 'act-add-sup',
      title: 'Add New Supplier Profile',
      category: 'Actions',
      icon: <PlusCircle size={15} />,
      action: () => navigate('/suppliers?action=new'),
    },
    {
      id: 'act-create-po',
      title: 'Draft Purchase Order',
      category: 'Actions',
      icon: <PlusCircle size={15} />,
      action: () => navigate('/orders?action=new'),
    },
    {
      id: 'act-ask-copilot',
      title: 'Query Copilot on Supply Risks',
      category: 'Actions',
      icon: <Sparkles size={15} />,
      action: () => navigate('/copilot?q=risk'),
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col font-sans">
      <ScrollProgress color="#4F46E5" />
      <TopBar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarOpen={!isSidebarCollapsed}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 overflow-y-auto px-[16px] sm:px-[28px] lg:px-[36px] py-[24px] max-w-[1600px] w-full mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        items={commandItems}
      />
    </div>
  );
};
