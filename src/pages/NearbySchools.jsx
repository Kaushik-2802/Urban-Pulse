import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { reverseGeocode } from "../utils/reverseGeocode";


import { getUserLocation } from "../utils/location";
import { fetchNearbySchools } from "../utils/fetchNearbySchools";

/* FIX LEAFLET ICONS */
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function NearbySchools() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null);
  

  useEffect(() => {
    document.body.style.margin = "0";

    getUserLocation()
      .then((loc) => {
        setUserLocation(loc);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
  if (!userLocation) return;

  reverseGeocode(userLocation.lat, userLocation.lon)
    .then(setAddress)
    .catch(console.error);
}, [userLocation]);

  useEffect(() => {
    if (!userLocation) return;

    fetchNearbySchools(userLocation.lat, userLocation.lon)
      .then((data) => {
        setSchools(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [userLocation]);

  if (loading) return <Page>Loading nearby schools...</Page>;

  return (
    <Page>
      <button onClick={() => navigate(-1)} style={backBtn}>
        ← Back
      </button>

      <h1>Nearby Schools</h1>

{address && (
  <p style={{ opacity: 0.7, marginTop: "-8px" }}>
    Showing results near{" "}
    <strong>
      {address.suburb ||
        address.neighbourhood ||
        address.city ||
        address.town}
    </strong>
  </p>
)}


      {userLocation && (
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

          {schools.map((s) => (
            <Marker key={s.id} position={[s.lat, s.lon]}>
              <Popup>
                <strong>{s.tags?.name || "School"}</strong>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </Page>
  );
}

/* STYLES (MATCH TRAFFIC PAGE) */

const backBtn = {
  marginBottom: "12px",
  background: "transparent",
  color: "#ef4444",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};

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
