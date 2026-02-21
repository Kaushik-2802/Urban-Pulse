import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setUserLoc({ lat, lng });

        const res = await fetch(
          `http://localhost:5000/api/events/nearby?lat=${lat}&lng=${lng}&radius=10`
        );

        const data = await res.json();
        setEvents(data);
        setLoading(false);
      },
      () => alert("Location permission denied")
    );
  }, []);

  if (loading) return <Page>Loading nearby events...</Page>;

  return (
    <Page>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>
        ← Back
      </button>

      <h1>Nearby Events 🎉</h1>

      {/* MAP */}
      {userLoc && (
        <MapContainer
          center={[userLoc.lat, userLoc.lng]}
          zoom={13}
          style={{ height: "300px", borderRadius: "12px", marginBottom: "20px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />

          {/* USER LOCATION */}
          <Marker position={[userLoc.lat, userLoc.lng]}>
            <Popup>You are here</Popup>
          </Marker>

          {/* EVENTS */}
          {events.map((e) => (
            <Marker
              key={e._id}
              position={[
                e.location.coordinates[1], // lat
                e.location.coordinates[0], // lng
              ]}
            >
              <Popup>
                <strong>{e.title}</strong>
                <br />
                {e.description}
                <br />
                {new Date(e.date).toDateString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* 📋 LIST */}
      {events.length === 0 && (
        <p style={{ opacity: 0.7 }}>No events within 10 km</p>
      )}

      {events.map((e) => (
        <div key={e._id} style={card}>
          <strong>{e.title}</strong>
          <p>{e.description}</p>
          <small>{new Date(e.date).toDateString()}</small>
        </div>
      ))}
      <button onClick={() => navigate("/host-event")} style={backBtn}>
  + Host Event
</button>

    </Page>
  );
}

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

const card = {
  padding: "14px",
  background: "rgba(30,41,59,0.6)",
  borderRadius: "12px",
  marginBottom: "10px",
};

const backBtn = {
  marginBottom: "12px",
  background: "transparent",
  color: "#ef4444",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};
