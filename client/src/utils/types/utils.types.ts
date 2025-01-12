export interface BreadcrumbProps {
  title: string;
  buttonTitle: string;
}

export interface EmptyProps {
  description: string;
}

export interface FormCreateProps {
  disable: boolean;
}

export interface FormUpdateProps {
  disable: boolean;
  placeName: string;
  placeType: string;
  placeAddress: string;
  placeOwner: string;
  placeDescription: string;
  placeLongitude: number;
  placeLatitude: number;
}
