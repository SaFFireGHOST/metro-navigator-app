import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Mock user storage
const USERS_KEY = 'lastmile_users';

const getStoredUsers = (): Array<{ email: string; password: string; name: string; id: string }> => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const storeUser = (user: { email: string; password: string; name: string; id: string }) => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getStoredUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          set({ 
            user: { id: user.id, email: user.email, name: user.name },
            isAuthenticated: true 
          });
          return { success: true };
        }

        return { success: false, error: 'Invalid email or password' };
      },

      signup: async (name: string, email: string, password: string) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getStoredUsers();
        
        if (users.find(u => u.email === email)) {
          return { success: false, error: 'Email already exists' };
        }

        const newUser = {
          id: `user_${Date.now()}`,
          email,
          password,
          name,
        };

        storeUser(newUser);
        
        set({ 
          user: { id: newUser.id, email: newUser.email, name: newUser.name },
          isAuthenticated: true 
        });

        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'lastmile-auth',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
