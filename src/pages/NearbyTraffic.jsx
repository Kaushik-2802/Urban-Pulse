import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import attractionIconImg from "leaflet/dist/images/marker-icon.png";


import { getUserLocation } from "../utils/location";
import { fetchTrafficRoute } from "../utils/traffic";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const attractionIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,

  iconSize: [18, 28],     
  iconAnchor: [9, 28],
  popupAnchor: [1, -24],
  shadowSize: [28, 28],

  className: "attraction-marker",
});


// Generate nearby cardinal points for default view
function generateNearbyPoints(lat, lon) {
  const d = 0.02;
  return [
    { lat: lat + d, lon, label: "North" },
    { lat: lat - d, lon, label: "South" },
    { lat, lon: lon + d, label: "East" },
    { lat, lon: lon - d, label: "West" },
  ];
}

// Determine traffic level from ETA
function getTrafficLevel(duration, staticDuration) {
  const live = parseInt(duration.replace("s", ""));
  const normal = parseInt(staticDuration.replace("s", ""));
  const delay = live - normal;
  if (delay < 120) return { label: "Low", color: "green" };
  if (delay < 300) return { label: "Moderate", color: "orange" };
  return { label: "Heavy", color: "red" };
}

// Debounce hook for destination input
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value]);
  return debounced;
}

export default function NearbyTraffic() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [destRoute, setDestRoute] = useState(null);
  const [destLoading, setDestLoading] = useState(false);

  const [aiInsights, setAiInsights] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const [attractions, setAttractions] = useState([]);
  const [poiLoading, setPoiLoading] = useState(false);


  const debouncedDest = useDebounce(destination, 400);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedDest) return setSuggestions([]);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            debouncedDest
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    };
    fetchSuggestions();
  }, [debouncedDest]);


  async function fetchNearbyAttractions(lat, lon, radius = 100000) {
  const query = `
    [out:json][timeout:25];
    (
      node["tourism"](around:${radius},${lat},${lon});
      node["amenity"~"restaurant|cafe|hospital|college|school|cinema|mall|place_of_worship"](around:${radius},${lat},${lon});
      node["leisure"~"park|stadium|playground"](around:${radius},${lat},${lon});
    );
    out center;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.elements || [];
  } catch (err) {
    console.error("Failed to fetch attractions", err);
    return [];
  }
}

  // Load default nearby traffic
  const loadNearbyTraffic = async () => {
    try {
      const location = await getUserLocation();
      setUserLocation(location);

      const points = generateNearbyPoints(location.lat, location.lon);

      const results = [];
      for (const p of points) {
        const route = await fetchTrafficRoute(
          { lat: location.lat, lng: location.lon },
          { lat: p.lat, lng: p.lon }
        );
        if (route) results.push(route);
      }

      const enriched = results.map((r, index) => {
        const live = Number(r.duration.replace("s", ""));
        const normal = Number(r.staticDuration.replace("s", ""));
        const traffic = getTrafficLevel(r.duration, r.staticDuration);

        return {
          direction: points[index].label,
          etaMin: Math.ceil(live / 60),
          normalMin: Math.ceil(normal / 60),
          delayMin: Math.max(0, Math.ceil(live / 60 - normal / 60)),
          path: polyline.decode(r.polyline.encodedPolyline),
          traffic,
        };
      });
      

      setRoutes(enriched);
      const pois = await fetchNearbyAttractions(location.lat, location.lon);
      setAttractions(pois);

    } catch (err) {
      console.error(err);
      alert("Unable to load traffic data");
    } finally {
      setLoading(false);
    }
  };

  const handleAttractionClick = async (poi) => {
  const name = poi.tags?.name || "Selected Location";

  setDestination(name);
  setDestLoading(true);

  try {
    const route = await fetchTrafficRoute(
      { lat: userLocation.lat, lng: userLocation.lon },
      { lat: poi.lat, lng: poi.lon }
    );

    if (route) {
      const live = Number(route.duration.replace("s", ""));
      const normal = Number(route.staticDuration.replace("s", ""));
      const traffic = getTrafficLevel(route.duration, route.staticDuration);

      const newRoute = {
        direction: name,
        etaMin: Math.ceil(live / 60),
        normalMin: Math.ceil(normal / 60),
        delayMin: Math.max(0, Math.ceil(live / 60 - normal / 60)),
        path: polyline.decode(route.polyline.encodedPolyline),
        traffic,
      };

      setDestRoute(newRoute);
      generateAIInsights([newRoute]);
    }
  } catch (err) {
    console.error("Failed to route to attraction", err);
  } finally {
    setDestLoading(false);
  }
};


  // Fetch traffic for selected destination
  const handleSelectSuggestion = async (suggestion) => {
    setDestination(suggestion.display_name);
    setSuggestions([]);
    setDestLoading(true);

    try {
      const lat = parseFloat(suggestion.lat);
      const lon = parseFloat(suggestion.lon);

      const route = await fetchTrafficRoute(
        { lat: userLocation.lat, lng: userLocation.lon },
        { lat, lng: lon }
      );

      if (route) {
        const live = Number(route.duration.replace("s", ""));
        const normal = Number(route.staticDuration.replace("s", ""));
        const traffic = getTrafficLevel(route.duration, route.staticDuration);

        const newRoute = {
          direction: suggestion.display_name,
          etaMin: Math.ceil(live / 60),
          normalMin: Math.ceil(normal / 60),
          delayMin: Math.max(0, Math.ceil(live / 60 - normal / 60)),
          path: polyline.decode(route.polyline.encodedPolyline),
          traffic,
        };

        setDestRoute(newRoute);

        // Call AI for recommendations per route
        generateAIInsights([newRoute]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch route for destination");
    } finally {
      setDestLoading(false);
    }
  };

  // Generate AI insights
  const generateAIInsights = async (routesToAnalyze) => {
    setAiLoading(true);
    try {
      const res = await fetch("http://localhost:5000/ai/traffic-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routes: routesToAnalyze }),
      });
      const data = await res.json();
      // Split insights by line to display in panel
      setAiInsights(data.insights.split("\n").filter((line) => line));
    } catch (err) {
      console.error(err);
      setAiInsights([
        "AI insights temporarily unavailable. You can still view traffic and ETA.",
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.margin = "0";
    loadNearbyTraffic();
  }, []);

  if (loading) return <Page>Loading traffic data...</Page>;

  return (
    <Page>
      <button onClick={() => navigate(-1)} style={backBtn}>
        ← Back
      </button>

      <h1>Urban Pulse: AI Traffic Assistant</h1>

      {userLocation && (
        <>
          {/* Destination Input */}
          <div style={{ marginBottom: "20px", position: "relative" }}>
            <input
              type="text"
              placeholder="Enter a destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                width: "60%",
                marginRight: "10px",
                border: "none",
                outline: "none",
              }}
            />
            {suggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  left: 0,
                  width: "60%",
                  background: "#1e293b",
                  borderRadius: "8px",
                  overflow: "hidden",
                  zIndex: 1000,
                }}
              >
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectSuggestion(s)}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #334155",
                    }}
                  >
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
            {destLoading && <span style={{ marginLeft: "10px" }}>Loading...</span>}
          </div>

          {/* Map */}
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

            {/* Nearby Local Attractions */}
{attractions.map((poi, i) => (
  <Marker
    key={i}
    position={[poi.lat, poi.lon]}
    icon={attractionIcon}
    eventHandlers={{
      click: () => handleAttractionClick(poi),
    }}
  >
    <Popup>
      <div style={{ fontSize: "14px" }}>
        <strong>{poi.tags?.name || "Unnamed Place"}</strong>
        <br />
        <span style={{ opacity: 0.7 }}>
          {poi.tags?.tourism ||
            poi.tags?.amenity ||
            poi.tags?.leisure ||
            "Attraction"}
        </span>
        <br />
        <span style={{ color: "#22c55e" }}>
          Click to route 🚦
        </span>
      </div>
    </Popup>
  </Marker>
))}


            {/* Nearby traffic */}
            {/* {routes.map((r, i) => (
              <Polyline
                key={i}
                positions={r.path}
                pathOptions={{ color: r.traffic.color, weight: 5 }}
              />
            ))} */}

            {/* Destination AI route highlighted */}
            {destRoute && (
              <Polyline
                positions={destRoute.path}
                pathOptions={{
                  color: "limegreen",
                  weight: 6,
                  dashArray: "5,10",
                }}
              />
            )}
          </MapContainer>

          {/* Traffic Cards */}
          <h2 style={{ marginTop: "25px" }}>Traffic Overview</h2>

          <div style={cardGrid}>
            {routes.map((r, i) => (
              <div key={i} style={trafficCard}>
                <h3>{r.direction}</h3>
                <div style={{ color: r.traffic.color, fontWeight: "bold", marginBottom: "6px" }}>
                  ● {r.traffic.label} Traffic
                </div>
                <div>ETA: {r.etaMin} min</div>
                <div style={{ opacity: 0.7 }}>Normal: {r.normalMin} min</div>
                {r.delayMin > 0 && <div style={{ color: "#facc15" }}>Delay: +{r.delayMin} min</div>}
              </div>
            ))}

            {destRoute && (
              <div style={trafficCard}>
                <h3>{destRoute.direction}</h3>
                <div
                  style={{ color: "limegreen", fontWeight: "bold", marginBottom: "6px" }}
                >
                  ● AI Recommended Route
                </div>
                <div>ETA: {destRoute.etaMin} min</div>
                <div style={{ opacity: 0.7 }}>Normal: {destRoute.normalMin} min</div>
                {destRoute.delayMin > 0 && <div style={{ color: "#facc15" }}>Delay: +{destRoute.delayMin} min</div>}
              </div>
            )}
          </div>

          {/* AI Insights Panel */}
          {aiLoading ? (
            <div style={{ marginTop: "20px" }}>Generating AI insights...</div>
          ) : (
            aiInsights.length > 0 && (
              <div
                style={{
                  marginTop: "20px",
                  background: "rgba(15,23,42,0.85)",
                  padding: "18px",
                  borderRadius: "14px",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                <h3>AI Route Insights & Recommendations</h3>
                <ul>
                  {aiInsights.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )
          )}

          {/* LEGEND */}
          <div style={legend}>
            <span style={{ color: "green" }}>● Low</span>
            <span style={{ color: "orange" }}>● Moderate</span>
            <span style={{ color: "red" }}>● Heavy</span>
            <span style={{ color: "limegreen" }}>● AI Recommended</span>
          </div>
        </>
      )}
    </Page>
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
