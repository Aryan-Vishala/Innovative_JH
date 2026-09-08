import { useState } from "react";
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

  const roleData = roles.find(
    (item) => item.id === role
  );

  const Icon = roleData.icon;


  const handleSubmit = (event) => {

    event.preventDefault();

    if (isRegister) {
      alert("Registration will be connected to the backend soon.");
    } else {
      navigate("/dashboard");
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

          <span>
            {isRegister
              ? "Creating account as"
              : "Signing in as"}
          </span>

          <strong>
            {roleData.title}
          </strong>

        </div>

      </div>


      {/* Heading */}

      <div className="auth-heading">

        <span className="step-label">
          {isRegister
            ? "CREATE ACCOUNT"
            : "SECURE LOGIN"}
        </span>

        <h2>
          {isRegister
            ? `Register as ${roleData.title}`
            : `${roleData.title} Login`}
        </h2>

        <p>
          {isRegister
            ? getRegisterDescription(role)
            : "Enter your credentials to access your account."}
        </p>

      </div>


      {/* Form */}

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >


        {/* Full Name */}

        {isRegister && (

          <FormField
            label="Full Name"
            placeholder="Enter your full name"
            icon={<UserRound size={17} />}
          />

        )}


        {/* University / Industry Name */}

        {isRegister &&
          (role === "university" ||
            role === "industry") && (

            <FormField
              label={
                role === "university"
                  ? "Institution Name"
                  : "Organization Name"
              }
              placeholder={
                role === "university"
                  ? "Enter university / institution name"
                  : "Enter organization name"
              }
              icon={
                role === "university"
                  ? <GraduationCap size={17} />
                  : <Building2 size={17} />
              }
            />

          )}


        {/* Citizen Phone */}

        {isRegister &&
          role === "citizen" && (

            <FormField
              label="Phone Number"
              placeholder="+91 XXXXX XXXXX"
              icon={<Phone size={17} />}
            />

          )}


        {/* Location */}

        {isRegister &&
          (role === "university" ||
            role === "industry") && (

            <FormField
              label="Location"
              placeholder="City / District"
              icon={<MapPin size={17} />}
            />

          )}


        {/* Email */}

        <FormField
          label={
            role === "citizen"
              ? "Email or Mobile Number"
              : "Official Email Address"
          }
          placeholder={
            role === "citizen"
              ? "Enter email or mobile number"
              : "Enter your official email"
          }
          icon={<Mail size={17} />}
        />


        {/* Password */}

        <div className="form-field">

          <label>
            Password
          </label>


          <div className="input-wrapper">

            <LockKeyhole size={17} />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              required
            />


            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >

              {showPassword
                ? <EyeOff size={17} />
                : <Eye size={17} />}

            </button>

          </div>

        </div>


        {/* Terms */}

        {isRegister && (

          <label className="terms">

            <input
              type="checkbox"
              required
            />

            <span>

              I agree to the{" "}

              <a href="#">
                Terms of Use
              </a>{" "}

              and{" "}

              <a href="#">
                Privacy Policy
              </a>.

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


            <button
              type="button"
            >
              Forgot password?
            </button>

          </div>

        )}


        {/* Submit */}

        <button
          className="submit-button"
          type="submit"
        >

          {isRegister
            ? "Create Account"
            : "Sign In"}

          <ArrowRight size={17} />

        </button>

      </form>


      {/* Switch */}

      <div className="auth-switch">

        {isRegister
          ? "Already have an account?"
          : "Don't have an account?"}

        <button
          onClick={() =>
            changeMode(
              isRegister
                ? "login"
                : "register"
            )
          }
        >

          {isRegister
            ? "Sign in"
            : "Create account"}

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
}) {

  return (
    <div className="form-field">

      <label>
        {label}
      </label>


      <div className="input-wrapper">

        {icon}

        <input
          type={type}
          placeholder={placeholder}
          required
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