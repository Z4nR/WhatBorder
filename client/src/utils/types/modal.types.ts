export interface ClientProps {
  setState: (state: boolean) => void;
  state: boolean;
  listDevice: string;
  deleteClient: string;
  rejectClient: string;
}

export interface StatisticProps {
  setState: (state: boolean) => void;
  state: boolean;
  id: string;
}

export interface ConfirmProps {
  title: string;
  okText: string;
  cancelText: string;
  onOk: () => void;
  onCancel: () => void;
  open: boolean;
  taskType: string;
}

export interface EditProfileProps {
  setState: (state: boolean) => void;
  state: boolean;
  initialValue: {
    username: string;
    fullname: string;
    description: string;
  };
}

export interface DeleteProfileProps {
  setState: (state: boolean) => void;
  state: boolean;
}
