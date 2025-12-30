export const fetchNearbyHospitals = async (lat, lon) => {
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:5000,${lat},${lon});
      node["amenity"="clinic"](around:5000,${lat},${lon});
      node["amenity"="doctors"](around:5000,${lat},${lon});
    );
    out body;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });

  return (await res.json()).elements;
};
