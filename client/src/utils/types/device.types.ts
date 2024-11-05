export interface DeviceProps {
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
  setDevice: (state: DeviceProps) => void;
  clearDevice: () => void;
}
