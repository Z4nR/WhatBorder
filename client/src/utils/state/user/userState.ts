import { create } from 'zustand';
import { UserData, UserState } from './user.types';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUserState = create<UserState>()(
  persist(
    (set) => ({
      id: '',
      name: '',
      exp: 0,
      setUser: (state: UserData) => set(() => ({ ...state })),
      clearUser: () => set(() => ({ id: '', name: '', exp: 0 })),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserState;
