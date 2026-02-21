import { useState, useEffect } from "react";

export default function WorkerProfileForm({ userId, onBack }) {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    gender: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      country: "",
      pincode: "",
    },
    profession: "",
    serviceAreas: [],
  });

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    if (!userId) return;

    async function fetchProfile() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/worker/profile/${userId}`
        );
        if (!res.ok) throw new Error();

        const data = await res.json();

        setProfile({
          name: data.name || "",
          phone: data.phone || "",
          gender: data.gender || "",
          address: {
            addressLine1: data.address?.addressLine1 || "",
            addressLine2: data.address?.addressLine2 || "",
            city: data.address?.city || "",
            country: data.address?.country || "",
            pincode: data.address?.pincode || "",
          },
          profession: data.profession || "",
          serviceAreas: data.serviceAreas || [],
        });
      } catch {
        console.log("No profile yet");
      } finally {
        setLoaded(true);
      }
    }

    fetchProfile();
  }, [userId]);

  /* ================= EDIT HANDLERS ================= */

  const handleEdit = (field) => {
    setEditingField(field);
    if (field === "serviceAreas") {
      setEditValue([...profile.serviceAreas]);
    } else if (field.startsWith("address.")) {
      const key = field.split(".")[1];
      setEditValue(profile.address[key]);
    } else {
      setEditValue(profile[field]);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleSave = async (field) => {
    setSaving(true);
    let updatedProfile = { ...profile };

    if (field === "serviceAreas") {
      updatedProfile.serviceAreas = editValue;
    } else if (field.startsWith("address.")) {
      const key = field.split(".")[1];
      updatedProfile.address = {
        ...profile.address,
        [key]: editValue,
      };
    } else {
      updatedProfile[field] = editValue;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/worker/profile/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, ...updatedProfile }),
        }
      );

      if (!res.ok) throw new Error();

      setProfile(updatedProfile);
      setEditingField(null);
    } catch {
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  /* ================= FIELD COMPONENT ================= */

  const ProfileField = ({ field, value }) => {
    const isEditing = editingField === field;

    return (
      <div
        style={profileItemStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "transparent")
        }
      >
        <div style={fieldWrapperStyle}>
          <div style={fieldInfoStyle}>
            <label style={labelStyle}>{field}</label>

            {!isEditing && (
              <div style={valueStyle}>
                {value ? (
                  <span>{value}</span>
                ) : (
                  <span style={placeholderStyle}>Not provided</span>
                )}
              </div>
            )}
          </div>

          {!isEditing && (
            <button
              style={editButtonStyle}
              onClick={() => handleEdit(field)}
            >
              ✏️
            </button>
          )}
        </div>

        {isEditing && (
          <div style={editSectionStyle}>
            {field === "serviceAreas" ? (
              <div style={checkboxGrid}>
                {[
                  "Delhi",
                  "Mumbai",
                  "Chennai",
                  "Bangalore",
                  "Hyderabad",
                  "Kolkata",
                  "Pune",
                ].map((city) => (
                  <label key={city} style={checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={editValue.includes(city)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditValue([...editValue, city]);
                        } else {
                          setEditValue(
                            editValue.filter((a) => a !== city)
                          );
                        }
                      }}
                    />
                    {city}
                  </label>
                ))}
              </div>
            ) : (
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                style={editInputStyle}
                autoFocus
              />
            )}

            <div style={buttonRow}>
              <button
                style={cancelButtonStyle}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                style={saveButtonStyle}
                onClick={() => handleSave(field)}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!loaded) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            {profile.name || "Worker Profile"}
          </h1>
          <p style={subtitleStyle}>
            Manage your professional information
          </p>
        </div>
        <button style={backButton} onClick={onBack}>
          ← Back
        </button>
      </div>

      {/* Content */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Personal Info</h2>
          <ProfileField field="name" value={profile.name} />
          <ProfileField field="phone" value={profile.phone} />
          <ProfileField field="gender" value={profile.gender} />
          <ProfileField field="profession" value={profile.profession} />
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitle}>Address</h2>
          <ProfileField
            field="address.addressLine1"
            value={profile.address.addressLine1}
          />
          <ProfileField
            field="address.city"
            value={profile.address.city}
          />
          <ProfileField
            field="address.country"
            value={profile.address.country}
          />
          <ProfileField
            field="address.pincode"
            value={profile.address.pincode}
          />
        </div>

        <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
          <h2 style={sectionTitle}>Service Areas</h2>
          <ProfileField
            field="serviceAreas"
            value={profile.serviceAreas.join(", ")}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const containerStyle = {
  minHeight: "100vh",
  padding: "40px",
  background:
    "linear-gradient(180deg, #0f0f1a 0%, #181827 100%)",
  color: "white",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px",
};

const titleStyle = {
  fontSize: "32px",
  fontWeight: "700",
};

const subtitleStyle = {
  color: "#9ca3af",
};

const backButton = {
  padding: "10px 20px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  cursor: "pointer",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
  gap: "28px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.05)",
  borderRadius: "20px",
  padding: "24px",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.1)",
};

const sectionTitle = {
  marginBottom: "16px",
};

const profileItemStyle = {
  padding: "16px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "12px",
  transition: "0.3s",
};

const fieldWrapperStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const fieldInfoStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  fontSize: "12px",
  color: "#9ca3af",
  marginBottom: "6px",
};

const valueStyle = {
  fontSize: "16px",
};

const placeholderStyle = {
  fontStyle: "italic",
  color: "#6b7280",
};

const editButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "16px",
};

const editSectionStyle = {
  marginTop: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const editInputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #667eea",
  background: "rgba(0,0,0,0.4)",
  color: "white",
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
};

const saveButtonStyle = {
  padding: "8px 16px",
  borderRadius: "8px",
  background: "#10b981",
  border: "none",
  color: "white",
  cursor: "pointer",
};

const cancelButtonStyle = {
  padding: "8px 16px",
  borderRadius: "8px",
  background: "#374151",
  border: "none",
  color: "white",
  cursor: "pointer",
};

const checkboxGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px,1fr))",
  gap: "10px",
};

const checkboxLabel = {
  fontSize: "14px",
};

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "60vh",
  fontSize: "20px",
  color: "#9ca3af",
};