import { create } from 'zustand';
import { UserData, UserState } from './user.types';

const useUserState = create<UserState>()((set) => ({
  role: false,
  name: '',
  exp: 0,
  setUser: (state: UserData) => set(() => ({ ...state })),
  clearUser: () => {
    console.log('cleanUserJalan');
    set(() => ({ role: false, exp: 0 }));
  },
}));

export default useUserState;
