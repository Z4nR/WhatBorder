export interface SocketProps {
  id: string;
  desktop: string;
  uniqueCode: string;
  client: string;
  type: string;
  mobile: boolean;
}

export interface SocketState {
  id: string;
  desktop: string;
  uniqueCode: string;
  client: string;
  type: string;
  mobile: boolean;
  setSocket: (state: SocketProps) => void;
  clearSocket: () => void;
}
