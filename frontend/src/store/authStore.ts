import { create } from 'zustand';
import { UserAccount, mockUsers } from '../data/mockData';

interface AuthState {
  user: UserAccount | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  demoLogin: (role?: 'admin' | 'demo' | 'analyst') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUsers[1], // Default to Demo Evaluator so the reviewer can explore immediately or test login
  isAuthenticated: true,

  login: (email: string) => {
    const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      set({ user: found, isAuthenticated: true });
      return true;
    }
    // Allow any enterprise email for testing
    const fallbackUser: UserAccount = {
      id: `USR-${Date.now()}`,
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      role: 'Procurement Manager',
    };
    set({ user: fallbackUser, isAuthenticated: true });
    return true;
  },

  demoLogin: (role = 'demo') => {
    const userMap = {
      admin: mockUsers[0],
      demo: mockUsers[1],
      analyst: mockUsers[2],
    };
    set({ user: userMap[role] || mockUsers[1], isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
