import { useState } from "react";

const CreateWorkerProfile = ({ userId, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    profession: "",
    serviceAreas: "",
    addressLine1: "",
    city: "",
    state: "",
    country: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔒 Frontend validation
    if (!form.name || !form.phone || !form.gender || !form.profession) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/worker/profile/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: form.name,
          phone: form.phone,
          gender: form.gender,
          profession: form.profession,
          serviceAreas: form.serviceAreas.split(",").map(s => s.trim()),
          address: {
            addressLine1: form.addressLine1,
            city: form.city,
            state: form.state,
            country: form.country
          }
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create profile");
        return;
      }

      onSuccess(data.profile); // 🔥 move to dashboard
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Worker Profile</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Full Name *" onChange={handleChange} />
        <input name="phone" placeholder="Phone Number *" onChange={handleChange} />

        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender *</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input name="profession" placeholder="Profession *" onChange={handleChange} />

        <input name="serviceAreas" placeholder="Service Areas (comma separated)" onChange={handleChange} />

        <input name="addressLine1" placeholder="Address Line" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <input name="state" placeholder="State" onChange={handleChange} />
        <input name="country" placeholder="Country" onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateWorkerProfile;


const styles = {
  container: {
    maxWidth: "420px",
    margin: "60px auto",
    padding: "24px",
    background: "#0f172a",
    borderRadius: "16px",
    color: "white"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  error: {
    color: "#f87171",
    textAlign: "center"
  }
};
