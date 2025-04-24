import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  isActive: boolean;
  role: string;
  userId: string;
  updatedAt: string;
  createdAt: string;
  isAdmin: boolean;
  email: string;
  name: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
      }),
      {
        name: 'user-storage',                          
        partialize: (state) => ({ user: state.user }), 
        storage: createJSONStorage(() => localStorage),
      }
    )
  )

export default useUserStore;
