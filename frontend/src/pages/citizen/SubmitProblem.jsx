import { useState } from "react";
import {
  Upload,
  MapPin,
  Send,
  Image,
  FileText,
} from "lucide-react";
import "./SubmitProblem.css";

function SubmitProblem() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    district: "",
    priority: "Medium",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Problem submitted:", {
      ...formData,
      file,
    });

    alert("Problem submitted successfully!");
  };

  return (
    <div className="submit-problem-page">

      <div className="submit-problem-header">
        <div>
          <h1>Submit a Problem</h1>
          <p>
            Help us identify and solve challenges in your community.
          </p>
        </div>
      </div>

      <form
        className="problem-form"
        onSubmit={handleSubmit}
      >

        {/* Basic Information */}

        <section className="form-section">

          <div className="section-heading">
            <FileText size={20} />

            <div>
              <h2>Problem Information</h2>
              <p>
                Tell us about the issue you are facing.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label>
              Problem Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Street lights not working"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the problem in detail..."
              rows="5"
              required
            />
          </div>

        </section>


        {/* Classification */}

        <section className="form-section">

          <div className="section-heading">
            <div>
              <h2>Problem Classification</h2>
              <p>
                Help us categorize the problem correctly.
              </p>
            </div>
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select category
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="Healthcare">
                  Healthcare
                </option>

                <option value="Agriculture">
                  Agriculture
                </option>

                <option value="Water Management">
                  Water Management
                </option>

                <option value="Sanitation">
                  Sanitation
                </option>

                <option value="Environment">
                  Environment
                </option>

                <option value="Urban Infrastructure">
                  Urban Infrastructure
                </option>

                <option value="Public Services">
                  Public Services
                </option>
              </select>
            </div>


            <div className="form-group">
              <label>
                District
              </label>

              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select district
                </option>

                <option value="Ranchi">
                  Ranchi
                </option>

                <option value="Jamshedpur">
                  East Singhbhum
                </option>

                <option value="Dhanbad">
                  Dhanbad
                </option>

                <option value="Bokaro">
                  Bokaro
                </option>

                <option value="Hazaribagh">
                  Hazaribagh
                </option>

                <option value="Deoghar">
                  Deoghar
                </option>
              </select>
            </div>

          </div>


          <div className="form-group">

            <label>
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

              <option value="Critical">
                Critical
              </option>
            </select>

          </div>

        </section>


        {/* Location */}

        <section className="form-section">

          <div className="section-heading">

            <MapPin size={20} />

            <div>
              <h2>Problem Location</h2>

              <p>
                Tell us where the problem is located.
              </p>
            </div>

          </div>

          <button
            type="button"
            className="location-btn"
          >
            <MapPin size={18} />

            Use My Location
          </button>

          <p className="location-note">
            Location services will be connected to the backend later.
          </p>

        </section>


        {/* Evidence */}

        <section className="form-section">

          <div className="section-heading">

            <Image size={20} />

            <div>
              <h2>Supporting Evidence</h2>

              <p>
                Upload photos or documents that help explain the problem.
              </p>
            </div>

          </div>

          <label className="upload-box">

            <Upload size={28} />

            <strong>
              Click to upload
            </strong>

            <span>
              Images, videos or documents
            </span>

            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,video/*,.pdf,.doc,.docx"
            />

          </label>

          {file && (
            <p className="selected-file">
              Selected: {file.name}
            </p>
          )}

        </section>


        {/* Submit */}

        <div className="form-actions">

          <button
            type="submit"
            className="submit-btn"
          >
            <Send size={18} />

            Submit Problem
          </button>

        </div>

      </form>

    </div>
  );
}

export default SubmitProblem;