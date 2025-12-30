import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getUserLocation } from "../utils/location";
import { fetchTrafficRoute } from "../utils/traffic";

/* Fix Leaflet icons */
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* ---------- HELPERS ---------- */

function generateNearbyPoints(lat, lon) {
  const d = 0.02;
  return [
    { lat: lat + d, lon, label: "North" },
    { lat: lat - d, lon, label: "South" },
    { lat, lon: lon + d, label: "East" },
    { lat, lon: lon - d, label: "West" },
  ];
}

function getTrafficLevel(duration, staticDuration) {
  const live = parseInt(duration.replace("s", ""));
  const normal = parseInt(staticDuration.replace("s", ""));
  const delay = live - normal;

  if (delay < 120) return { label: "Low", color: "green" };
  if (delay < 300) return { label: "Moderate", color: "orange" };
  return { label: "Heavy", color: "red" };
}

/* ---------- COMPONENT ---------- */

export default function NearbyTraffic() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
     document.body.style.margin = '0';
  const loadTraffic = async () => {
    try {
      const location = await getUserLocation();
      setUserLocation(location);

      const points = generateNearbyPoints(
        location.lat,
        location.lon
      );

      const results = [];

      for (const p of points) {
        const route = await fetchTrafficRoute(
          { lat: location.lat, lng: location.lon },
          { lat: p.lat, lng: p.lon }
        );

        if (route) {
          results.push(route);
        }
      }

  const enriched = results.map((r, index) => {
  const live = Number(r.duration.replace("s", ""));
  const normal = Number(r.staticDuration.replace("s", ""));
  const delay = live - normal;

  const traffic = getTrafficLevel(
    r.duration,
    r.staticDuration
  );

  return {
    direction: points[index].label,
    etaMin: Math.ceil(live / 60),
    normalMin: Math.ceil(normal / 60),
    delayMin: Math.max(0, Math.ceil(delay / 60)),
    path: polyline.decode(
      r.polyline.encodedPolyline
    ),
    traffic,
  };
});


      setRoutes(enriched);
    } catch (err) {
      console.error(err);
      alert("Unable to load traffic data");
    } finally {
      setLoading(false);
    }
  };

  loadTraffic();
}, []);


  if (loading) return <Page>Loading traffic data...</Page>;

 return (
  <div>
    <Page>
      <button onClick={() => navigate(-1)} style={backBtn}>
        ← Back
      </button>

      <h1>Nearby Traffic Situation</h1>

      {userLocation && (
        <>
          <MapContainer
            center={[userLocation.lat, userLocation.lon]}
            zoom={13}
            style={{ height: "350px", borderRadius: "12px" }}
          >
            <TileLayer
              attribution="© OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[userLocation.lat, userLocation.lon]}>
              <Popup>Your Location</Popup>
            </Marker>

            {routes.map((r, i) => (
              <Polyline
                key={i}
                positions={r.path}
                pathOptions={{
                  color: r.traffic.color,
                  weight: 5,
                }}
              />
            ))}
          </MapContainer>

          <h2 style={{ marginTop: "25px" }}>Traffic by Direction</h2>

          <div style={cardGrid}>
            {routes.map((r, i) => (
              <div key={i} style={trafficCard}>
                <h3>{r.direction}</h3>

                <div
                  style={{
                    color: r.traffic.color,
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}
                >
                  ● {r.traffic.label} Traffic
                </div>

                <div>ETA: {r.etaMin} min</div>
                <div style={{ opacity: 0.7 }}>
                  Normal: {r.normalMin} min
                </div>

                {r.delayMin > 0 && (
                  <div style={{ color: "#facc15" }}>
                    Delay: +{r.delayMin} min
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* LEGEND */}
      <div style={legend}>
        <span style={{ color: "green" }}>● Low</span>
        <span style={{ color: "orange" }}>● Moderate</span>
        <span style={{ color: "red" }}>● Heavy</span>
      </div>
    </Page>
  </div>
);
}

/* ---------- STYLES ---------- */

const Page = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      padding: "30px",
      background: "#020617",
      color: "white",
      border:'none',
      outline:'none'
    }}
  >
    {children}
  </div>
);

const backBtn = {
  marginBottom: "12px",
  background: "transparent",
  color: "#ef4444",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};

const legend = {
  display: "flex",
  gap: "20px",
  marginTop: "15px",
  fontWeight: "bold",
};

const cardGrid = {
  display: "grid",
  border:'none',
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginTop: "15px",
};

const trafficCard = {
  background: "rgba(30,41,59,0.6)",
  borderRadius: "14px",
  padding: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
};

