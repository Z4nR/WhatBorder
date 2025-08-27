import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { UserProps, UserState } from '../types/user.types';

const useUserState = create<UserState>()(
  persist(
    (set) => ({
      name: '',
      exp: 0,
      setUser: (state: UserProps) => set(() => ({ ...state })),
      clearUser: () => set(() => ({ role: 3, exp: 0, name: '' })),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserState;
