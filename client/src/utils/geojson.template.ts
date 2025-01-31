import { FeatureCollection } from 'geojson';

const geojsonConstructor = (
  latlong: [number, number][]
): FeatureCollection | null => {
  if (latlong.length === 0) {
    return null;
  }

  return {
    features: [
      {
        geometry: {
          coordinates: [[...latlong, latlong[0]]],
          type: 'Polygon',
        },
        properties: {},
        type: 'Feature',
      },
    ],
    type: 'FeatureCollection',
  };
};

const geojsonDeconstructor = (
  placeGeojson: FeatureCollection
): [number, number][] => {
  const geometry = placeGeojson.features[0].geometry;

  if (geometry.type === 'Polygon') {
    // Filter out invalid Positions to match [number, number][]
    const validCoordinates = geometry.coordinates[0].filter(
      (pos): pos is [number, number] => pos.length === 2
    );

    // Return all values except the last
    return validCoordinates.slice(0, -1);
  } else {
    return [[0, 0]];
  }
};

export { geojsonConstructor, geojsonDeconstructor };
