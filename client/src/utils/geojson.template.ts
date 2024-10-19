const geojsonTemplate = (latlong: any[]) => {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [latlong],
          type: 'Polygon',
        },
      },
    ],
  };
};

export default geojsonTemplate;
