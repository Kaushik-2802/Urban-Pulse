import { useState } from "react";

export default function CompleteWorkModal({ booking, onClose, onCompleted }) {
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [slide, setSlide] = useState(0);

  const handleComplete = async () => {
    const formData = new FormData();
    formData.append("afterPhoto", afterPhoto);

    await fetch(
      `http://localhost:5000/api/bookings/${booking._id}/complete`,
      {
        method: "POST",
        body: formData
      }
    );

    onCompleted();
  };

  return (
    <div className="modal">
      <h2>Complete Work</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAfterPhoto(e.target.files[0])}
      />

      <input
        type="range"
        min="0"
        max="100"
        value={slide}
        onChange={(e) => setSlide(e.target.value)}
      />

      {slide === "100" && (
        <button onClick={handleComplete}>
          Upload & Complete
        </button>
      )}

      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
