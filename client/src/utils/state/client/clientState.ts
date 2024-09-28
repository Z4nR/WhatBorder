import { create } from 'zustand';
import { SocketData, SocketState } from './client.types';
import { createJSONStorage, persist } from 'zustand/middleware';

const useSocketAdminState = create<SocketState>()(
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

const useSocketClientState = create<SocketState>()(
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

export default { useSocketAdminState, useSocketClientState };
