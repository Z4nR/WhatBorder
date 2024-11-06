import { create } from 'zustand';
import { DeviceProps, DeviceState } from '../../types/device.types';
import { createJSONStorage, persist } from 'zustand/middleware';

const useDeviceState = create<DeviceState>()(
  persist(
    (set) => ({
      uniqueCode: '',
      mobile: false,
      device: '',
      type: '',
      setDevice: (state: DeviceProps) => set(() => ({ ...state })),
      clearDevice: () =>
        set(() => ({ uniqueCode: '', mobile: false, device: '', type: '' })),
    }),
    {
      name: 'device',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useDeviceState;
