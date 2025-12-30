import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


import { getUserLocation } from "../utils/location";
import { fetchNearbyHospitals } from "../utils/hospitals";
import { getDistanceKm } from "../utils/distance";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


export default function NearbyHospitals() {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------- FETCH DATA -------- */
  useEffect(() => {
     document.body.style.margin = '0';
    const load = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);

        const results = await fetchNearbyHospitals(
          location.lat,
          location.lon
        );

        const sorted = results
          .map(p => ({
            name: p.tags?.name || "Unnamed",
            type: p.tags?.amenity,
            lat: p.lat,
            lon: p.lon,
            distance: getDistanceKm(
              location.lat,
              location.lon,
              p.lat,
              p.lon
            ),
          }))
          .sort((a, b) => a.distance - b.distance);

        setPlaces(sorted);
        setFiltered(sorted);
      } catch {
        alert("Location permission denied");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* -------- SEARCH FILTER -------- */
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      places.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      )
    );
  }, [search, places]);

  if (loading) return <Page>Loading nearby hospitals...</Page>;

  return (
    <Page>
      {/* 🔙 BACK BUTTON */}
      <button onClick={() => navigate(-1)} style={backBtn}>
        ← Back
      </button>

      <h1>Nearby Hospitals & Clinics</h1>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search hospital or clinic..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={searchBox}
      />

      {/* 🗺️ MAP VIEW */}
      {userLocation && (
        <MapContainer
          center={[userLocation.lat, userLocation.lon]}
          zoom={13}
          style={{ height: "300px", borderRadius: "12px", marginBottom: "20px" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map((p, i) => (
            <Marker key={i} position={[p.lat, p.lon]}>
              <Popup>
                <strong>{p.name}</strong>
                <br />
                {p.distance} km away
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* 📍 LIST + DIRECTIONS */}
      {filtered.map((p, i) => (
        <div key={i} style={card}>
          <div>
            <strong>{p.name}</strong>
            <div style={{ opacity: 0.7 }}>
              {p.type} • {p.distance} km
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
            target="_blank"
            rel="noopener noreferrer"
            style={dirBtn}
          >
            Directions
          </a>
        </div>
      ))}
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

const searchBox = {
  width: "100%",
  padding: "10px",
  margin: "15px 0",
  borderRadius: "8px",
  border: "none",
};

const card = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px",
  background: "rgba(30,41,59,0.6)",
  borderRadius: "12px",
  marginBottom: "10px",
};

const dirBtn = {
  background: "#ef4444",
  color: "white",
  padding: "8px 12px",
  borderRadius: "8px",
  textDecoration: "none",
};
