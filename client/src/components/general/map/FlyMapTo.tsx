import { FlyMapToProps } from '@/utils/types/statistic.types';
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FlyMapTo: React.FC<FlyMapToProps> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    console.log('Position:', position);
    if (position && position.length === 2) {
      map.flyTo(position);
    }
  }, [position, map]);

  return null;
};

export default FlyMapTo;
