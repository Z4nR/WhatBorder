export interface DeviceData {
  uniqueCode: string;
  device: string;
  type: string;
  mobile: boolean;
}

export interface DeviceState {
  uniqueCode: string;
  device: string;
  type: string;
  mobile: boolean;
  setDevice: (state: DeviceData) => void;
  clearDevice: () => void;
}
