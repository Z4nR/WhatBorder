import { GetProp, TableColumnsType, TransferProps } from 'antd';

export type TransferItem = GetProp<TransferProps, 'dataSource'>[number];

export interface DataType {
  key: string;
  title: string;
  description: string;
  tag: string;
}

export interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: TableColumnsType<DataType>;
  rightColumns: TableColumnsType<DataType>;
}
