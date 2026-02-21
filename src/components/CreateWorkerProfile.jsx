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
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setError("");

    if (step === 1 && (!form.name || !form.phone || !form.gender)) {
      setError("Please fill all required fields");
      return;
    }

    if (step === 2 && !form.profession) {
      setError("Please enter your profession");
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.addressLine1.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.country.trim()
    ) {
      setError("Please fill all address fields");
      return;
    }
    setLoading(true);



    try {
      const res = await fetch(
        "http://localhost:5000/api/worker/profile/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            name: form.name,
            phone: form.phone,
            gender: form.gender,
            profession: form.profession,
            serviceAreas: form.serviceAreas
              ? form.serviceAreas.split(",").map((s) => s.trim())
              : [],
            address: {
              addressLine1: form.addressLine1,
              city: form.city,
              state: form.state,
              country: form.country
            }
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create profile");
        return;
      }

      onSuccess(data.profile);
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Worker Profile</h2>
        <p style={styles.subtitle}>Complete your details to start accepting jobs</p>

        {/* Step Indicator */}
        <div style={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                ...styles.stepCircle,
                background: step >= s ? "#6366f1" : "#1e293b"
              }}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }} />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {step === 1 && (
            <>
              <Input label="Full Name *" name="name" value={form.name} onChange={handleChange} />
              <Input label="Phone Number *" name="phone" value={form.phone} onChange={handleChange} />

              <label style={styles.label}>Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange} style={styles.input}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </>
          )}

          {step === 2 && (
            <>
              <Input label="Profession *" name="profession" value={form.profession} onChange={handleChange} />
              <Input label="Service Areas" name="serviceAreas" value={form.serviceAreas} onChange={handleChange} />
            </>
          )}

          {step === 3 && (
            <>
              <Input label="Address Line" name="addressLine1" value={form.addressLine1} onChange={handleChange} />
              <Input label="City" name="city" value={form.city} onChange={handleChange} />
              <Input label="State" name="state" value={form.state} onChange={handleChange} />
              <Input label="Country" name="country" value={form.country} onChange={handleChange} />
            </>
          )}

          <div style={styles.buttonRow}>
            {step > 1 && (
              <button type="button" onClick={prevStep} style={styles.secondaryBtn}>
                Back
              </button>
            )}

            {step < 3 ? (
              <button type="button" onClick={nextStep} style={styles.primaryBtn}>
                Next
              </button>
            ) : (
              <button type="submit" disabled={loading} style={styles.primaryBtn}>
                {loading ? "Creating..." : "Create Profile"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <>
    <label style={styles.label}>{label}</label>
    <input {...props} style={styles.input} />
  </>
);

export default CreateWorkerProfile;

/* =================== STYLES =================== */

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(12px)",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    color: "white"
  },
  title: {
    textAlign: "center",
    marginBottom: "6px",
    fontSize: "22px"
  },
  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  label: {
    fontSize: "13px",
    color: "#cbd5e1"
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    outline: "none",
    transition: "0.2s"
  },
  error: {
    color: "#f87171",
    textAlign: "center",
    marginBottom: "10px"
  },
  progressContainer: {
    height: "6px",
    background: "#1e293b",
    borderRadius: "10px",
    marginBottom: "16px"
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    borderRadius: "10px",
    transition: "0.3s ease"
  },
  stepIndicator: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px"
  },
  stepCircle: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },
  primaryBtn: {
    padding: "10px 18px",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer"
  },
  secondaryBtn: {
    padding: "10px 18px",
    background: "transparent",
    border: "1px solid #334155",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer"
  }
};