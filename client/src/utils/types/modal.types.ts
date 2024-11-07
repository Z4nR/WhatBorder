export interface ClientModalProps {
  setState: (state: boolean) => void;
  state: boolean;
  listDevice: string;
  deleteClient: string;
  rejectClient: string;
}

export interface StatisticModalProps {
  setState: (state: boolean) => void;
  state: boolean;
  id: string;
}

export interface ConfirmModalProps {
  title: string;
  okText: string;
  cancelText: string;
  onOk: () => void;
  onCancel: () => void;
  open: boolean;
  taskType: string;
}
