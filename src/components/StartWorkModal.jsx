import { useState } from "react";

export default function StartWorkModal({ booking, onClose, onStarted }) {
  const [items, setItems] = useState("");
  const [beforePhoto, setBeforePhoto] = useState(null);

  const handleStart = async () => {
    const formData = new FormData();
    formData.append("items", items);
    formData.append("beforePhoto", beforePhoto);

    await fetch(
      `http://localhost:5000/api/bookings/${booking._id}/start`,
      {
        method: "POST",
        body: formData
      }
    );

    onStarted();
  };

  return (
    <div className="modal">
      <h2>Start Work</h2>

      <textarea
        placeholder="Items required (comma separated)"
        value={items}
        onChange={(e) => setItems(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setBeforePhoto(e.target.files[0])}
      />

      <button onClick={handleStart}>Start Work</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
