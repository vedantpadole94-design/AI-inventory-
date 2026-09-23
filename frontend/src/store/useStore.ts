import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Language, NotificationItem, Preferences } from '../types';

interface AppState {
  language: Language;
  setLanguage: (language: Language) => void;
  notifications: NotificationItem[];
  addNotification: (item: NotificationItem) => void;
  markNotificationRead: (id: string) => void;
  preferences: Preferences;
  setPreferences: (prefs: Partial<Preferences>) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (value: boolean) => void;
}

const defaultPreferences: Preferences = {
  compactMode: false,
  showTips: true,
  accentColor: '#4A90E2',
  enableRealtime: true,
  density: 'comfortable',
};

export const useStore = create<AppState>()(
  devtools((set) => ({
    language: 'en',
    setLanguage: (language) => set({ language }),
    notifications: [
      {
        id: 'n1',
        title: 'Delivery alert',
        message: 'Supplier Northwind Electronics is 6 hours behind schedule.',
        type: 'warning',
        createdAt: new Date().toISOString(),
        read: false,
      },
      {
        id: 'n2',
        title: 'Forecast update',
        message: 'Copper prices are expected to rise in the next 30 days.',
        type: 'info',
        createdAt: new Date().toISOString(),
        read: false,
      },
    ],
    addNotification: (item) => set((state) => ({ notifications: [item, ...state.notifications] })),
    markNotificationRead: (id) => set((state) => ({
      notifications: state.notifications.map((item) => item.id === id ? { ...item, read: true } : item),
    })),
    preferences: defaultPreferences,
    setPreferences: (prefs) => set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    })),
    onboardingComplete: false,
    setOnboardingComplete: (value) => set({ onboardingComplete: value }),
  })),
);
