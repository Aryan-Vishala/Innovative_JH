import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  MapPin,
  Send,
  Image,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { problemApi } from "../../services/api";
import "./SubmitProblem.css";

const JHARKHAND_DISTRICTS = [
  "Bokaro",
  "Chatra",
  "Deoghar",
  "Dhanbad",
  "Dumka",
  "East Singhbhum",
  "Garhwa",
  "Giridih",
  "Godda",
  "Gumla",
  "Hazaribagh",
  "Jamtara",
  "Khunti",
  "Koderma",
  "Latehar",
  "Lohardaga",
  "Pakur",
  "Palamu",
  "Ramgarh",
  "Ranchi",
  "Sahibganj",
  "Saraikela Kharsawan",
  "Simdega",
  "West Singhbhum",
];

function SubmitProblem() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    district: "",
    block: "",
    panchayat: "",
    village: "",
    priority: "Medium",
    estimatedPopulation: "",
    frequency: "Daily",
    latitude: null,
    longitude: null,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser.");
      return;
    }
    setLocationStatus("Locating via GPS...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        setLocationStatus(
          `GPS Acquired: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        );
      },
      (err) => {
        setLocationStatus(`Could not fetch GPS: ${err.message}`);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("description", formData.description);
      dataToSend.append("category", formData.category);
      dataToSend.append("district", formData.district);
      dataToSend.append("block", formData.block || "Central Block");
      dataToSend.append("panchayat", formData.panchayat || "");
      dataToSend.append("village", formData.village || "");
      dataToSend.append("citizenReportedSeverity", formData.priority);
      dataToSend.append("frequency", formData.frequency);
      dataToSend.append("estimatedPopulation", formData.estimatedPopulation || 0);

      if (formData.latitude && formData.longitude) {
        dataToSend.append("latitude", formData.latitude);
        dataToSend.append("longitude", formData.longitude);
      }

      if (file) {
        dataToSend.append("evidenceFiles", file);
      }

      const res = await problemApi.submit(dataToSend);

      if (res.success && res.data) {
        setSuccessInfo(res.data);
      } else {
        throw new Error(res.message || "Failed to submit problem");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage(
        err.message || "Failed to submit problem. Please ensure you are logged in."
      );
    } finally {
      setLoading(false);
    }
  };

  if (successInfo) {
    return (
      <div className="submit-problem-page" style={{ maxWidth: "600px", margin: "40px auto", textAlign: "center" }}>
        <div style={{ background: "#ffffff", padding: "40px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <CheckCircle2 size={64} color="#10b981" style={{ margin: "0 auto 16px" }} />
          <h1 style={{ fontSize: "24px", color: "#111827", marginBottom: "8px" }}>Problem Reported Successfully!</h1>
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            Your problem has been registered and assigned unique ID:
          </p>
          <div style={{ background: "#f3f4f6", padding: "12px 20px", borderRadius: "8px", fontWeight: "700", fontSize: "20px", color: "#059669", display: "inline-block", marginBottom: "24px" }}>
            {successInfo.problemId}
          </div>
          <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.6", marginBottom: "32px" }}>
            It is now queued for local ground inspection by the <strong>{successInfo.location?.district} Local PRI / ULB</strong> administration.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => navigate("/citizen")}
              className="submit-btn"
              style={{ padding: "12px 24px" }}
            >
              Go to Citizen Dashboard
            </button>
            <button
              onClick={() => {
                setSuccessInfo(null);
                setFormData({
                  title: "",
                  description: "",
                  category: "",
                  district: "",
                  block: "",
                  panchayat: "",
                  village: "",
                  priority: "Medium",
                  estimatedPopulation: "",
                  frequency: "Daily",
                  latitude: null,
                  longitude: null,
                });
                setFile(null);
              }}
              style={{ padding: "12px 24px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff", cursor: "pointer", fontWeight: "600" }}
            >
              Report Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-problem-page">
      <div className="submit-problem-header">
        <div>
          <h1>Submit a Problem</h1>
          <p>Help us identify and solve challenges in your community across Jharkhand.</p>
        </div>
      </div>

      {errorMessage && (
        <div style={{
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          padding: "14px 18px",
          borderRadius: "8px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: "1px solid #f87171"
        }}>
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form className="problem-form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <section className="form-section">
          <div className="section-heading">
            <FileText size={20} />
            <div>
              <h2>Problem Information</h2>
              <p>Tell us about the issue you are facing.</p>
            </div>
          </div>

          <div className="form-group">
            <label>Problem Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: High fluoride in drinking borewells"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the problem in detail, what is affected, and how long it has been persisting..."
              rows="5"
              required
            />
          </div>
        </section>

        {/* Classification */}
        <section className="form-section">
          <div className="section-heading">
            <div>
              <h2>Problem Classification & Location</h2>
              <p>Help us categorize and locate the problem in Jharkhand.</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Water Management">Water Management</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Urban Infrastructure">Urban Infrastructure</option>
                <option value="Energy">Energy</option>
                <option value="Public Services">Public Services</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>District *</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              >
                <option value="">Select district</option>
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Block / Area</label>
              <input
                type="text"
                name="block"
                value={formData.block}
                onChange={handleChange}
                placeholder="Example: Kamdara, Kanke, Govindpur"
              />
            </div>

            <div className="form-group">
              <label>Panchayat / Village</label>
              <input
                type="text"
                name="panchayat"
                value={formData.panchayat}
                onChange={handleChange}
                placeholder="Example: Kamdara North / Barigaon"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority / Severity</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Estimated People Affected</label>
              <input
                type="number"
                name="estimatedPopulation"
                value={formData.estimatedPopulation}
                onChange={handleChange}
                placeholder="e.g. 250"
              />
            </div>
          </div>
        </section>

        {/* Location & GPS */}
        <section className="form-section">
          <div className="section-heading">
            <MapPin size={20} />
            <div>
              <h2>Geolocation Coordinates</h2>
              <p>Tag the exact location for ground inspection teams.</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <button
              type="button"
              className="location-btn"
              onClick={handleGetLocation}
            >
              <MapPin size={18} />
              Use My Current GPS Location
            </button>
            {formData.latitude && (
              <span style={{ fontSize: "13px", color: "#059669", fontWeight: "600" }}>
                ✓ GPS Coordinates Linked
              </span>
            )}
          </div>

          {locationStatus && (
            <p className="location-note" style={{ color: "#4b5563" }}>
              {locationStatus}
            </p>
          )}
        </section>

        {/* Evidence */}
        <section className="form-section">
          <div className="section-heading">
            <Image size={20} />
            <div>
              <h2>Supporting Evidence</h2>
              <p>Upload photos, lab reports, or documents that explain the problem.</p>
            </div>
          </div>

          <label className="upload-box">
            <Upload size={28} />
            <strong>Click to upload evidence</strong>
            <span>Photos, test reports, or documents (PDF, JPG, PNG)</span>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
          </label>

          {file && (
            <p className="selected-file" style={{ color: "#059669", fontWeight: "600" }}>
              ✓ Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </section>

        {/* Submit */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
          >
            <Send size={18} />
            {loading ? "Registering Problem into Atlas..." : "Submit Problem to Ecosystem"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubmitProblem;