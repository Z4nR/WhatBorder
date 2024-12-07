import { FeatureCollection } from 'geojson';

const geojsonTemplate = (
  latlong: [number, number][]
): FeatureCollection | null => {
  if (latlong.length === 0) {
    return null;
  }

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [[...latlong, latlong[0]]],
          type: 'Polygon',
        },
      },
    ],
  };
};

export default geojsonTemplate;
