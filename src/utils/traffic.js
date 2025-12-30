export async function fetchTrafficRoute(origin, destination) {
  const res = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_KEY,
        "X-Goog-FieldMask":
          "routes.duration,routes.staticDuration,routes.polyline.encodedPolyline",
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: origin.lat,
              longitude: origin.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.lat,
              longitude: destination.lng,
            },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
      }),
    }
  );

  const text = await res.text();
  console.error("Routes API status:", res.status);
  console.error("Routes API response:", text);

  if (!res.ok) {
    throw new Error(text);
  }

  return JSON.parse(text).routes?.[0];
}
