import { create } from 'zustand';
import { UserProps, UserState } from '../../types/user.types';
import { createJSONStorage, persist } from 'zustand/middleware';

const useUserState = create<UserState>()(
  persist(
    (set) => ({
      role: false,
      name: '',
      exp: 0,
      setUser: (state: UserProps) => set(() => ({ ...state })),
      clearUser: () => set(() => ({ role: false, exp: 0, name: '' })),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserState;
