import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthProps, AuthState } from '../types/auth.types';

const useAuthState = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: '',
      setToken: (state: AuthProps) => set(() => ({ ...state })),
      deleteToken: () => set(() => ({ accessToken: '' })),
    }),
    {
      name: 'authToken',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthState;
