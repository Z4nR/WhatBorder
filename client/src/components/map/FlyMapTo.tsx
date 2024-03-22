import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface FlyMapToProps {
  position: [number, number] | null;
}

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
