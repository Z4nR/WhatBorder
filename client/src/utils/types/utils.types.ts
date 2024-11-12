export interface BreadcrumbProps {
  title: string;
  buttonTitle: string;
}

export interface EmptyProps {
  description: string;
}

export interface FormInputProps {
  disable: boolean;
}

export interface CoordinateListProps {
  addRef: React.MutableRefObject<(fieldsValue?: any, index?: number) => void>;
  disable: boolean;
}
