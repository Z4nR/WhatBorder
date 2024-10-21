const geojsonTemplate = (latlong: [number, number][]) => {
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
console.log(geojsonTemplate);

export default geojsonTemplate;
