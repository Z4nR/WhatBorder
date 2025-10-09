import { DashboardChartProps, PlaceListProps } from './statistic.types';
import { FeatureCollection } from 'geojson';

export interface PlaceTypeCreateProps {
  namecreate: string;
  labelcreate: string;
  colorcreate: string;
}

export interface PlaceTypeUpdateProps {
  buildingid: number;
  nameupdate: string;
  labelupdate: string;
  colorupdate: string;
}

export interface DashboardAdminChartProps {
  data: {
    totalPlace: number;
    totalPlaceThisMonth: number;
    percentageComparison: string;
    statusPercentage: string;
    chartCreate: DashboardChartProps[];
    chartUpdate: DashboardChartProps[];
    chartType: DashboardChartProps[];
    chartArea: DashboardAdminMapProps[];
    newPlace: PlaceListProps[];
  };
  loading: boolean;
}

export interface DashboardAdminMapProps {
  placeId: string;
  placeName: string;
  placeOwner: string;
  placeCenterLong: number;
  placeCenterLat: number;
}

export interface AdminPlaceTableProps {
  placeId: string;
  placeOwner: string;
  placeDescription: string;
  placeName: string;
  placeAddress: string;
  placeCenterPoint: any;
  placeMap: {
    placeGeojson: FeatureCollection;
  };
  type: {
    name: string;
    label: string;
    color: string;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUserOnlyTableProps {
  userId: string;
  userName: string;
  activeStatus: boolean;
  createdAt: Date;
  role: {
    roleName: string;
    label: string;
  };
}
