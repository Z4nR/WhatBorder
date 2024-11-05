import { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';
import { ColumnsType } from 'antd/es/table';

export type TransferItem = GetProp<TransferProps, 'dataSource'>[number];

export interface PlaceMapProps {
  placeId: string;
  placeGeo: any;
}

export interface ComparePlaceProps {
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
  dataSource: ComparePlaceProps[];
  leftColumns: TableColumnsType<ComparePlaceProps>;
  rightColumns: TableColumnsType<ComparePlaceProps>;
}

export interface UserPlaceProps {
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

export interface TableUserProps extends TableProps<UserPlaceProps> {
  dataSource: UserPlaceProps[];
  columns: ColumnsType<UserPlaceProps>;
}