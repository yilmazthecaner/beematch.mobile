import { create } from 'zustand';
import { UserProfile } from '../types/user';

interface AppState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  matches: UserProfile[];
  setMatches: (matches: UserProfile[]) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  matches: [],
  setMatches: (matches) => set({ matches }),
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));