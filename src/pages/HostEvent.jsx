import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";

export default function HostEvent() {
  const [venues, setVenues] = useState([]); // MUST be array
  const [selectedVenue, setSelectedVenue] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    capacity: "",
  });

  const navigate = useNavigate();

  // 📍 Fetch nearby venues
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          const res = await fetch(
            `http://localhost:5000/api/venues/nearby?lat=${lat}&lon=${lon}`
          );

          const data = await res.json();

          // SAFETY: ensure array
          if (Array.isArray(data)) {
            setVenues(data);
          } else {
            console.error("Invalid venue response:", data);
            setVenues([]);
          }
        } catch (err) {
          console.error("Venue fetch failed:", err);
          setVenues([]);
        }
      },
      () => alert("Location permission denied")
    );
  }, []);

  // 📨 Create event
  const submitEvent = async () => {
    if (!selectedVenue) return alert("Select a venue");
    if (!form.title || !form.date || !form.capacity) {
      return alert("Fill all required fields");
    }

    try {
      await fetch("http://localhost:5000/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          date: form.date,
          capacity: Number(form.capacity),
          lat: selectedVenue.lat,
          lng: selectedVenue.lng,
          venueName: selectedVenue.name,
        }),
      });

      navigate("/events");
    } catch (err) {
      console.error("Event creation failed:", err);
      alert("Failed to create event");
    }
  };

  return (
    <div style={{ padding: 30, color: "white" }}>
      <h2>Host an Event</h2>

      <input
        placeholder="Event Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />
      <br />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />
      <br />

      <input
        type="datetime-local"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />
      <br />

      {/* 🆕 CAPACITY INPUT */}
      <input
        type="number"
        placeholder="Event Capacity"
        value={form.capacity}
        onChange={(e) =>
          setForm({ ...form, capacity: e.target.value })
        }
      />
      <br />

      <h3>Select Venue</h3>

      <MapContainer
        center={[17.385, 78.4867]}
        zoom={13}
        style={{ height: 300 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {Array.isArray(venues) &&
          venues.map((v) => (
            <Marker
              key={v.id}
              position={[v.lat, v.lng]}
              eventHandlers={{
                click: () => setSelectedVenue(v),
              }}
            >
              <Popup>{v.name}</Popup>
            </Marker>
          ))}
      </MapContainer>

      {selectedVenue && (
        <p>Selected Venue: {selectedVenue.name}</p>
      )}

      <button onClick={submitEvent}>Create Event</button>
    </div>
  );
}
