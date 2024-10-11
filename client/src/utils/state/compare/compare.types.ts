import { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';
import { ColumnsType } from 'antd/es/table';

export type TransferItem = GetProp<TransferProps, 'dataSource'>[number];

export interface DataType {
  placeId: string;
  placeName: string;
  placeAddress: string;
  placeMap: {
    place_geojson: any;
  };
  type: {
    name: string;
    label: string;
  };
  rangePlace: string;
}

export interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: TableColumnsType<DataType>;
  rightColumns: TableColumnsType<DataType>;
}

export interface DataUserPlaceType {
  placeId: string;
  placeName: string;
  placeAddress: string;
  placeCenterPoint: any;
  placeMap: {
    place_geojson: any;
  };
  type: {
    name: string;
    label: string;
  };
  createdAt: Date;
}

export interface TableUserProps extends TableProps<DataUserPlaceType> {
  dataSource: DataUserPlaceType[];
  columns: ColumnsType<DataUserPlaceType>;
}
