import { create } from 'zustand';
import { SocketData, SocketState } from './client.types';
import { createJSONStorage, persist } from 'zustand/middleware';

const useSocketState = create<SocketState>()(
  persist(
    (set) => ({
      time: 0,
      id: '',
      desktop: '',
      client: '',
      type: '',
      mobile: false,
      setSocket: (state: SocketData) => set(() => ({ ...state })),
      clearSocket: () =>
        set(() => ({
          time: 0,
          id: '',
          desktop: '',
          client: '',
          type: '',
          mobile: false,
        })),
    }),
    {
      name: 'socketData',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useSocketState;
