import { FeatureCollection } from 'geojson';

const geojsonTemplate = (latlong: [number, number][]): FeatureCollection => {
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
