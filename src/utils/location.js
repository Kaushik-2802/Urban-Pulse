export const getUserLocation = () => {
  const cached = sessionStorage.getItem("userLocation");
  if (cached) {
    return Promise.resolve(JSON.parse(cached));
  }

  return new Promise((res) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        const loc = {
          lat: latitude,
          lon: longitude,
          accuracy,
          approximate: accuracy > 500,
        };

        sessionStorage.setItem("userLocation", JSON.stringify(loc));
        res(loc);
      },
      () => {
        // Absolute fallback — Hyderabad center (never fail UI)
        res({
          lat: 17.385,
          lon: 78.4867,
          accuracy: 5000,
          approximate: true,
        });
      },
      options
    );
  });
};

