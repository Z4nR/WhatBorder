import { create } from 'zustand';
import { AuthProps, AuthState } from '../../types/auth.types';
import { createJSONStorage, persist } from 'zustand/middleware';

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
