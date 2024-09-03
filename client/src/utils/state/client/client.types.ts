export interface SocketData {
  time: number;
  id: string;
  desktop: string;
  client: string;
  type: string;
  mobile: boolean;
}

export interface SocketState {
  time: number;
  id: string;
  desktop: string;
  client: string;
  type: string;
  mobile: boolean;
  setSocket: (state: SocketData) => void;
  clearSocket: () => void;
}
