export interface SocketData {
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
  setSocket: (state: SocketData) => void;
  clearSocket: () => void;
}
