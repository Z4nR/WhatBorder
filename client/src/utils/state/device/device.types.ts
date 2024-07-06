export interface DeviceData {
  device: string;
  type: string;
  mobile: boolean;
}

export interface DeviceState {
  device: string;
  type: string;
  mobile: boolean;
  setDevice: (state: DeviceData) => void;
  clearDevice: () => void;
}
