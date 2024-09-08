import { create } from 'zustand';
import { DeviceData, DeviceState } from './device.types';
import { createJSONStorage, persist } from 'zustand/middleware';

const useDeviceState = create<DeviceState>()(
  persist(
    (set) => ({
      mobile: false,
      device: '',
      type: '',
      setDevice: (state: DeviceData) => set(() => ({ ...state })),
      clearDevice: () => set(() => ({ mobile: false, device: '', type: '' })),
    }),
    {
      name: 'device',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useDeviceState;
