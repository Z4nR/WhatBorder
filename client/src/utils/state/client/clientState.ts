import { create } from 'zustand';
import { SocketData, SocketState } from './client.types';
import { createJSONStorage, persist } from 'zustand/middleware';

const useSocketState = create<SocketState>()(
  persist(
    (set) => ({
      id: '',
      desktop: '',
      uniqueCode: '',
      client: '',
      type: '',
      mobile: false,
      setSocket: (state: SocketData) => set(() => ({ ...state })),
      clearSocket: () =>
        set(() => ({
          id: '',
          desktop: '',
          uniqueCode: '',
          client: '',
          type: '',
          mobile: false,
        })),
    }),
    {
      name: 'socketData',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSocketState;
