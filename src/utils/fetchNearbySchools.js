export async function fetchNearbySchools(lat, lon, radius = 3000) {
  const query = `
    [out:json];
    (
      node["amenity"="school"](around:${radius},${lat},${lon});
      node["amenity"="college"](around:${radius},${lat},${lon});
      node["amenity"="university"](around:${radius},${lat},${lon});
    );
    out;
  `;

  const res = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      body: query
    }
  );

  const data = await res.json();
  return data.elements;
}
