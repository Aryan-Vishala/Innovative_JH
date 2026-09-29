import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Landmark,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { authApi } from "../../services/api";
import "./Auth.css";

const roles = [
  {
    id: "citizen",
    title: "Citizen",
    description: "Report local problems and track their resolution.",
    icon: UserRound,
  },
  {
    id: "university",
    title: "University",
    description: "Solve real-world challenges through innovation.",
    icon: GraduationCap,
  },
  {
    id: "industry",
    title: "Industry",
    description: "Collaborate, mentor, fund and deploy solutions.",
    icon: Building2,
  },
  {
    id: "government",
    title: "Government",
    description: "Monitor challenges, projects and social impact.",
    icon: Landmark,
  },
];

const roleStatistics = {
  citizen: {
    title: "Citizen Impact",
    subtitle: "Empowering communities to drive change",
    stats: [
      { label: "Students Logged In", value: "1,245" },
      { label: "Problems Posted", value: "3,872" },
      { label: "Problems Solved", value: "2,156" },
    ],
    features: [
      "Report community issues instantly",
      "Track problem resolution progress",
      "Connect with local universities",
    ],
  },
  university: {
    title: "University Innovation",
    subtitle: "Transforming education into real-world impact",
    stats: [
      { label: "Total Universities", value: "47" },
      { label: "Active Research Projects", value: "234" },
      { label: "Industry Partnerships", value: "89" },
    ],
    topUniversities: [
      { name: "IIT Dhanbad", problemsSolved: 342 },
      { name: "BIT Mesra", problemsSolved: 287 },
      { name: "NIT Jamshedpur", problemsSolved: 245 },
      { name: "Ranchi University", problemsSolved: 198 },
      { name: "Bokaro Steel City", problemsSolved: 156 },
    ],
    features: [
      "Access real-world challenges",
      "Showcase student innovations",
      "Build industry partnerships",
    ],
  },
  industry: {
    title: "Industry Collaboration",
    subtitle: "Bridging the gap between academia and industry",
    stats: [
      { label: "Industries Collaborated", value: "156" },
      { label: "Projects Funded", value: "89" },
      { label: "Mentorship Sessions", value: "342" },
    ],
    features: [
      "Discover innovative solutions",
      "Mentor upcoming talent",
      "Invest in promising projects",
    ],
  },
  government: {
    title: "Government Oversight",
    subtitle: "Monitoring progress and ensuring accountability",
    stats: [
      { label: "Problems Solved", value: "2,156" },
      { label: "Pending Problems", value: "1,716" },
      { label: "Projects Under Development", value: "423" },
    ],
    features: [
      "Track regional development",
      "Monitor social impact metrics",
      "Coordinate with stakeholders",
    ],
  },
};

function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get("mode") || "login";
  const selectedRole = searchParams.get("role");

  const [role, setRole] = useState(selectedRole || null);
  const [showPassword, setShowPassword] = useState(false);

  // Sync role state when URL parameter changes (e.g. direct link or role switcher)
  useEffect(() => {
    setRole(selectedRole || null);
  }, [selectedRole]);

  const isRegister = mode === "register";

  const changeMode = (newMode) => {
    navigate(
      `/auth?mode=${newMode}${role ? `&role=${role}` : ""}`
    );
  };

  const selectRole = (selectedRoleId) => {
    setRole(selectedRoleId);

    navigate(
      `/auth?mode=${mode}&role=${selectedRoleId}`
    );
  };

  const handleBack = () => {
    setRole(null);
    navigate(`/auth?mode=${mode}`);
  };

  return (
    <div className="auth-page">

      {/* =========================
          LEFT BRAND PANEL
      ========================= */}

      <section className="auth-brand">

        <div className="brand-content">

          <Link to="/" className="auth-logo">

            <div className="auth-logo-mark">
              IJ
            </div>

            <div>
              <strong>Innovative</strong>
              <span>Jharkhand</span>
            </div>

          </Link>


          {role && roleStatistics[role] ? (
            <DynamicBrandContent role={role} />
          ) : (
            <div className="brand-message">

              <span className="brand-tag">
                <ShieldCheck size={12} />
                SOCIETAL INNOVATION PLATFORM
              </span>

              <h1>
                From local
                <span> problems</span>
                <br />
                to real solutions.
              </h1>

              <p>
                Connecting citizens, universities, industry and
                government to build a smarter and more innovative
                Jharkhand.
              </p>

              <div className="brand-features">

                <Feature text="Report and track community challenges" />

                <Feature text="Connect problems with universities" />

                <Feature text="Enable industry collaboration" />

              </div>

            </div>
          )}

        </div>


        <div className="brand-footer">
          Government of Jharkhand · Innovation & Collaboration Portal
        </div>

      </section>


      {/* =========================
          RIGHT FORM PANEL
      ========================= */}

      <section className="auth-form-section">

        <div className="auth-container">

          {!role ? (

            <RoleSelection
              mode={mode}
              onSelect={selectRole}
            />

          ) : (

            <AuthForm
              role={role}
              isRegister={isRegister}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onBack={handleBack}
              changeMode={changeMode}
            />

          )}

        </div>

      </section>

    </div>
  );
}


/* =====================================================
   DYNAMIC BRAND CONTENT
===================================================== */

function DynamicBrandContent({ role }) {
  const stats = roleStatistics[role];

  return (
    <div className="brand-message dynamic-content">

      <span className="brand-tag">
        <ShieldCheck size={12} />
        SOCIETAL INNOVATION PLATFORM
      </span>

      <h1>
        {stats.title}
      </h1>

      <p>
        {stats.subtitle}
      </p>

      <div className="role-statistics">

        {stats.stats.map((stat, index) => (
          <div key={index} className="stat-item">

            <div className="stat-value">
              {stat.value}
            </div>

            <div className="stat-label">
              {stat.label}
            </div>

          </div>
        ))}

      </div>

      {role === "university" && stats.topUniversities && (
        <div className="top-universities">

          <h3>Top Universities by Problems Solved</h3>

          <div className="universities-list">

            {stats.topUniversities.map((university, index) => (
              <div key={index} className="university-item">

                <div className="university-rank">
                  #{index + 1}
                </div>

                <div className="university-info">

                  <div className="university-name">
                    {university.name}
                  </div>

                  <div className="university-stats">
                    {university.problemsSolved} problems solved
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

      <div className="brand-features">

        {stats.features.map((feature, index) => (
          <Feature key={index} text={feature} />
        ))}

      </div>

    </div>
  );
}


/* =====================================================
   ROLE SELECTION
===================================================== */

function RoleSelection({ mode, onSelect }) {

  const navigate = useNavigate();

  const isRegister = mode === "register";

  const switchMode = () => {

    navigate(
      `/auth?mode=${isRegister ? "login" : "register"}`
    );

  };

  return (
    <div className="role-selection">

      <div className="mobile-logo">

        <div className="auth-logo-mark">
          IJ
        </div>

        <strong>
          Innovative Jharkhand
        </strong>

      </div>


      <div className="auth-heading">

        <span className="step-label">
          STEP 1 OF 2
        </span>

        <h2>
          {isRegister
            ? "Create your account"
            : "Welcome back"}
        </h2>

        <p>
          {isRegister
            ? "Choose how you will participate in the innovation ecosystem."
            : "Choose your role to continue to the portal."}
        </p>

      </div>


      <div className="role-grid">

        {roles
          .filter(
            (item) =>
              isRegister
                ? item.id !== "government"
                : true
          )
          .map((item) => (

            <RoleCard
              key={item.id}
              role={item}
              onClick={() => onSelect(item.id)}
            />

          ))}

      </div>


      <div className="auth-switch">

        {isRegister
          ? "Already have an account?"
          : "Don't have an account?"}

        <button onClick={switchMode}>
          {isRegister
            ? "Sign in"
            : "Create account"}
        </button>

      </div>

    </div>
  );
}


/* =====================================================
   ROLE CARD
===================================================== */

function RoleCard({ role, onClick }) {

  const Icon = role.icon;

  return (
    <button
      className="role-card"
      onClick={onClick}
    >

      <div className="role-icon">
        <Icon size={23} />
      </div>


      <div className="role-content">

        <h3>
          {role.title}
        </h3>

        <p>
          {role.description}
        </p>

      </div>


      <ArrowRight
        className="role-arrow"
        size={18}
      />

    </button>
  );
}


/* =====================================================
   ROLE SPECIFIC DEMO ACCOUNTS & METADATA
===================================================== */

const roleSpecificAccounts = {
  citizen: [
    {
      label: "Rahul Kumar",
      sublabel: "Active Citizen · Kamdara, Gumla",
      roleBadge: "Citizen",
      email: "citizen@gumla.in",
      defaultPassword: "password123",
      info: "Drinking Water Quality Reporter",
    },
    {
      label: "Rahul Verma",
      sublabel: "Student Citizen · Morabadi, Ranchi",
      roleBadge: "Student Citizen",
      email: "student.rahul@gmail.com",
      defaultPassword: "password123",
      info: "Community Upvoter & Tracker",
    },
  ],
  university: [
    {
      label: "Dr. A.K. Singh",
      sublabel: "Dean of R&D · BAU Ranchi",
      roleBadge: "Nodal HEI Dean",
      email: "nodal.water@bau.edu.in",
      defaultPassword: "password123",
      info: "Water & Agriculture Challenge Nodal Lead",
    },
    {
      label: "Prof. Rajiv Ranjan",
      sublabel: "HoD Electronics & IoT · BIT Mesra",
      roleBadge: "Faculty Lead",
      email: "faculty.bit@bitmesra.ac.in",
      defaultPassword: "password123",
      info: "Smart IoT & Sensor Systems Capstone",
    },
    {
      label: "Ananya Mukherjee",
      sublabel: "Student Innovation Lead · IIT ISM Dhanbad",
      roleBadge: "Student Innovator",
      email: "innovator@iitdhanbad.ac.in",
      defaultPassword: "password123",
      info: "TRL-3 IoT Water Filter Prototype Team",
    },
  ],
  government: [
    {
      label: "Sanjay Oraon",
      sublabel: "Mukhiya · Kamdara Gram Panchayat",
      roleBadge: "PRI Mukhiya",
      email: "pri.kamdara@jharkhand.gov.in",
      defaultPassword: "password123",
      info: "Ground Truth & Field Verification Officer",
    },
    {
      label: "Rameshwar Prasad",
      sublabel: "Municipal Commissioner · Ranchi Municipal Corp",
      roleBadge: "ULB Officer",
      email: "ulb.ranchi@jharkhand.gov.in",
      defaultPassword: "password123",
      info: "Urban Infrastructure & Sanctions",
    },
    {
      label: "Dr. Sunita Murmu",
      sublabel: "Secretary · State Innovation Council",
      roleBadge: "State Admin",
      email: "admin@jharkhand.gov.in",
      defaultPassword: "password123",
      info: "State Nodal Cell & Challenge Governance",
    },
    {
      label: "Pooja Singhal, IAS",
      sublabel: "Deputy Commissioner · Gumla",
      roleBadge: "District Collector",
      email: "dc.gumla@jharkhand.gov.in",
      defaultPassword: "password123",
      info: "District Innovation Sanctions & Funding",
    },
  ],
  industry: [
    {
      label: "Vikramaditya Sharma",
      sublabel: "Head of CSR & Sustainability · Tata Steel",
      roleBadge: "CSR Lead",
      email: "csr.lead@tatasteel.com",
      defaultPassword: "password123",
      info: "₹2.5L Hardware Pledger & Corporate Mentor",
    },
    {
      label: "Amitabh Roy",
      sublabel: "Managing Director · CleanTech Innovations MSME",
      roleBadge: "MSME Director",
      email: "director@cleantech-jh.in",
      defaultPassword: "password123",
      info: "Commercial Sensor Pilot & Deployment Partner",
    },
  ],
};

const roleMeta = {
  citizen: {
    portalTitle: "Citizen Portal Login",
    badgeText: "CITIZEN & COMMUNITY LOGIN",
    subtitle: "Log in to post local community challenges, upvote civic priorities, and monitor verified grassroots solutions in your panchayat.",
    demoBoxTitle: "Citizen Demo Accounts",
    demoBoxHint: "Click any verified citizen profile to auto-fill credentials:",
    emailLabel: "Email or Registered Mobile Number",
    emailPlaceholder: "e.g. citizen@gumla.in or 9876543210",
    primaryColor: "#059669",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    tagBg: "#dcfce7",
    tagColor: "#166534",
    activeRoleIcon: "👤",
  },
  university: {
    portalTitle: "University & HEI Portal Login",
    badgeText: "ACADEMIC & NODAL HEI LOGIN",
    subtitle: "Log in for Nodal Deans, Faculty Leads, and Student Innovators to adopt challenges as R&D capstones and advance TRL 1–5 prototypes.",
    demoBoxTitle: "University & Academic Demo Accounts",
    demoBoxHint: "Click any faculty, nodal officer, or student profile to auto-fill credentials:",
    emailLabel: "Institutional / University Email (.edu.in / .ac.in)",
    emailPlaceholder: "e.g. nodal.water@bau.edu.in or faculty.bit@bitmesra.ac.in",
    primaryColor: "#2563eb",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
    tagBg: "#dbeafe",
    tagColor: "#1e40af",
    activeRoleIcon: "🎓",
  },
  government: {
    portalTitle: "Government & Local Body Login",
    badgeText: "PRI, ULB & GOVERNMENT LOGIN",
    subtitle: "Log in for PRI Mukhiyas, Municipal Commissioners, and State Officers to verify ground truth, monitor 24-district impact, and sanction projects.",
    demoBoxTitle: "Government & Local Body Demo Accounts",
    demoBoxHint: "Click any administrative profile to auto-fill verified credentials:",
    emailLabel: "Official Government Email (.gov.in)",
    emailPlaceholder: "e.g. pri.kamdara@jharkhand.gov.in or admin@jharkhand.gov.in",
    primaryColor: "#0f766e",
    bgColor: "#f0fdfa",
    borderColor: "#99f6e4",
    tagBg: "#ccfbf1",
    tagColor: "#115e59",
    activeRoleIcon: "🏛️",
  },
  industry: {
    portalTitle: "Industry & Corporate Partner Login",
    badgeText: "INDUSTRY & CSR PARTNERS LOGIN",
    subtitle: "Log in for Corporate CSR heads, MSMEs, and Investors to pledge funding grants, mentor student teams, and scale pilot innovations.",
    demoBoxTitle: "Industry & Corporate Demo Accounts",
    demoBoxHint: "Click any industry partner profile to auto-fill credentials:",
    emailLabel: "Corporate / Business Email Address",
    emailPlaceholder: "e.g. csr.lead@tatasteel.com or director@cleantech-jh.in",
    primaryColor: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    tagBg: "#fef3c7",
    tagColor: "#92400e",
    activeRoleIcon: "💼",
  },
};

/* =====================================================
   LOGIN / REGISTER FORM
===================================================== */

function AuthForm({
  role,
  isRegister,
  showPassword,
  setShowPassword,
  onBack,
  changeMode,
}) {
  const navigate = useNavigate();
  const roleData = roles.find((item) => item.id === role);
  const Icon = roleData ? roleData.icon : UserRound;
  const meta = roleMeta[role] || roleMeta.citizen;
  const currentAccounts = roleSpecificAccounts[role] || [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    organizationName: "",
    district: "Ranchi",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleQuickFill = (acc) => {
    setFormData((prev) => ({
      ...prev,
      email: acc.email,
      password: acc.defaultPassword || "password123",
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (isRegister) {
        // Register API call
        const payload = {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          primaryRole: role === "university" ? "participating_hei" : role,
          organizationName: formData.organizationName || undefined,
          organizationType:
            role === "university"
              ? "participating_hei"
              : role === "industry"
              ? "industry"
              : undefined,
          district: formData.district || formData.location || "Ranchi",
        };

        const res = await authApi.register(payload);
        if (role === "citizen") {
          navigate("/citizen");
        } else {
          navigate("/dashboard");
        }
      } else {
        // Login API call
        const res = await authApi.login({
          email: formData.email,
          password: formData.password,
          role,
        });

        const userRole = res.user?.primaryRole;
        if (userRole === "citizen") {
          navigate("/citizen");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMessage(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-wrapper">
      {/* Back */}
      <button
        className="back-button"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={17} />
        Change role
      </button>

      {/* Selected Role */}
      <div className="selected-role">
        <div className="selected-role-icon">
          <Icon size={20} />
        </div>
        <div>
          <span>{isRegister ? "Creating account as" : "Signing in as"}</span>
          <strong>{roleData ? roleData.title : "User"}</strong>
        </div>
      </div>

      {/* Heading */}
      <div className="auth-heading">
        <span className="step-label">
          {isRegister ? "CREATE ACCOUNT" : meta.badgeText}
        </span>
        <h2>
          {isRegister
            ? `Register as ${roleData ? roleData.title : "User"}`
            : meta.portalTitle}
        </h2>
        <p>
          {isRegister
            ? getRegisterDescription(role)
            : meta.subtitle}
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div style={{
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          padding: "10px 14px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "14px",
          border: "1px solid #f87171"
        }}>
          {errorMessage}
        </div>
      )}

      {/* Quick-Fill Role-Specific Demo Accounts Box */}
      {!isRegister && currentAccounts.length > 0 && (
        <div
          style={{
            background: meta.bgColor,
            border: `1px solid ${meta.borderColor}`,
            borderRadius: "10px",
            padding: "14px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: meta.tagColor,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>{meta.activeRoleIcon}</span>
              <span>{meta.demoBoxTitle}</span>
            </div>
            <span
              style={{
                fontSize: "11px",
                color: "#475569",
                fontWeight: "500",
                background: "#ffffff",
                padding: "2px 8px",
                borderRadius: "12px",
                border: `1px solid ${meta.borderColor}`,
              }}
            >
              Password: <strong>password123</strong>
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: currentAccounts.length > 1 ? "1fr 1fr" : "1fr",
              gap: "8px",
            }}
          >
            {currentAccounts.map((acc, idx) => {
              const isSelected =
                formData.email.toLowerCase() === acc.email.toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textAlign: "left",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    background: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                    border: isSelected
                      ? `2px solid ${meta.primaryColor}`
                      : `1px solid ${meta.borderColor}`,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected
                      ? "0 2px 8px rgba(0, 0, 0, 0.08)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      gap: "4px",
                      marginBottom: "2px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#1e293b",
                      }}
                    >
                      {acc.label}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        background: meta.tagBg,
                        color: meta.tagColor,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {acc.roleBadge}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      lineHeight: "1.3",
                    }}
                  >
                    {acc.sublabel}
                  </div>
                  <div
                    style={{
                      fontSize: "10.5px",
                      color: meta.primaryColor,
                      fontWeight: "500",
                      marginTop: "3px",
                    }}
                  >
                    {acc.email}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Form */}
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        {/* Full Name */}
        {isRegister && (
          <FormField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            icon={<UserRound size={17} />}
          />
        )}

        {/* University / Industry Name */}
        {isRegister &&
          (role === "university" || role === "industry") && (
            <FormField
              label={
                role === "university"
                  ? "Institution Name"
                  : "Organization Name"
              }
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              placeholder={
                role === "university"
                  ? "Enter university / institution name"
                  : "Enter organization name"
              }
              icon={
                role === "university" ? (
                  <GraduationCap size={17} />
                ) : (
                  <Building2 size={17} />
                )
              }
            />
          )}

        {/* Citizen Phone */}
        {isRegister && role === "citizen" && (
          <FormField
            label="Phone Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="+91 XXXXX XXXXX"
            icon={<Phone size={17} />}
          />
        )}

        {/* Location */}
        {isRegister &&
          (role === "university" || role === "industry") && (
            <FormField
              label="Location"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="City / District (e.g. Ranchi, Gumla)"
              icon={<MapPin size={17} />}
            />
          )}

        {/* Email */}
        <FormField
          label={meta.emailLabel}
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={meta.emailPlaceholder}
          icon={<Mail size={17} />}
        />

        {/* Password */}
        <div className="form-field">
          <label>Password</label>
          <div className="input-wrapper">
            <LockKeyhole size={17} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Terms */}
        {isRegister && (
          <label className="terms">
            <input type="checkbox" required />
            <span>
              I agree to the <a href="#">Terms of Use</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </span>
          </label>
        )}

        {/* Login Options */}
        {!isRegister && (
          <div className="form-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <button type="button">Forgot password?</button>
          </div>
        )}

        {/* Submit */}
        <button
          className="submit-button"
          type="submit"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
        >
          {loading
            ? "Processing..."
            : isRegister
            ? "Create Account"
            : "Sign In"}
          <ArrowRight size={17} />
        </button>
      </form>

      {/* Switch */}
      <div className="auth-switch">
        {isRegister ? "Already have an account?" : "Don't have an account?"}
        <button
          onClick={() =>
            changeMode(isRegister ? "login" : "register")
          }
        >
          {isRegister ? "Sign in" : "Create account"}
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   FORM FIELD
===================================================== */

function FormField({
  label,
  placeholder,
  icon,
  type = "text",
  name,
  value,
  onChange,
  required = true,
}) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <div className="input-wrapper">
        {icon}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}


/* =====================================================
   BRAND FEATURE
===================================================== */

function Feature({ text }) {

  return (
    <div className="brand-feature">

      <CheckCircle2 size={14} />

      <span>
        {text}
      </span>

    </div>
  );
}


/* =====================================================
   REGISTER DESCRIPTION
===================================================== */

function getRegisterDescription(role) {

  if (role === "citizen") {

    return "Create an account to report and track societal challenges.";

  }

  if (role === "university") {

    return "Register your institution to participate in solving real-world challenges.";

  }

  if (role === "industry") {

    return "Register your organization to collaborate with universities and communities.";

  }

  return "";
}


export default Auth;