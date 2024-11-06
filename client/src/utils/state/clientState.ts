import { create } from 'zustand';
import { SocketProps, SocketState } from '../../types/client.types';
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
      setSocket: (state: SocketProps) => set(() => ({ ...state })),
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
