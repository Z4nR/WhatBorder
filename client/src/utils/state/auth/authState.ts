import { create } from 'zustand';
import { AuthData, AuthState } from './auth.types';
import { createJSONStorage, persist } from 'zustand/middleware';

const useAuthState = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: '',
      setToken: (state: AuthData) => set(() => ({ ...state })),
      deleteToken: () => set(() => ({ accessToken: '' })),
    }),
    {
      name: 'authToken',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthState;
