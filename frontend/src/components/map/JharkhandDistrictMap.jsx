import React, { useState } from "react";
import {
  MapPin,
  Sparkles,
  GraduationCap,
  Building2,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight,
  Filter,
  Activity,
  Award,
} from "lucide-react";
import "./JharkhandDistrictMap.css";

// 24 Districts of Jharkhand with Geographic Division, Verified Problems count, and Active University-Industry Pilots
export const JHARKHAND_DISTRICTS_DATA = [
  // South Chotanagpur Division
  {
    id: "Gumla",
    name: "Gumla",
    division: "South Chotanagpur",
    verifiedCount: 4,
    hasActivePilot: true,
    leadingHEI: "BIT Mesra & BAU",
    partnerCSR: "Tata Steel Foundation",
    coordinates: { x: 195, y: 310, w: 90, h: 75 },
    activePilots: [
      {
        title: "Community Solar Fluoride Adsorption Plant",
        hei: "BIT Mesra (Jal-Shuddhi Team)",
        industry: "Tata Steel Foundation",
        trl: "Level 5 (Scaled Deployment)",
        metrics: "Fluoride: 2.4 PPM → 0.35 PPM Safe",
      },
      {
        title: "Vetiver Bio-Engineering Check-Dam Desiltation",
        hei: "Birsa Agricultural University (BAU)",
        industry: "CleanTech MSME",
        trl: "Level 4 (Field Testing)",
        metrics: "Storage capacity +45% in Barigaon",
      },
      {
        title: "Zero-Electricity School Water Filter",
        hei: "IIT (ISM) Dhanbad",
        industry: "District CSR Fund",
        trl: "Level 3 (Prototype Ready)",
        metrics: "Iron removal 96.8% in Kamdara Central",
      },
    ],
  },
  {
    id: "Ranchi",
    name: "Ranchi",
    division: "South Chotanagpur (State Capital)",
    verifiedCount: 3,
    hasActivePilot: true,
    leadingHEI: "BIT Lalpur & RIMS",
    partnerCSR: "RMC & CleanTech Innovations",
    coordinates: { x: 300, y: 285, w: 85, h: 70 },
    activePilots: [
      {
        title: "Modular Bio-Enzymatic Silt Trap & Wetland Mat",
        hei: "BIT Lalpur & RIMS",
        industry: "RMC Urban Mission",
        trl: "Level 5 (Scaled Deployment)",
        metrics: "Zero overflow; -94% mosquito larvae",
      },
      {
        title: "PCM Solar Cold Micro-Storage (Lac & Mahua)",
        hei: "ICAR-IINRG & Ranchi University",
        industry: "Jharkhand Agro MSME",
        trl: "Level 1 (Ground Verified)",
        metrics: "30-40% harvest loss mitigation",
      },
    ],
  },
  {
    id: "Khunti",
    name: "Khunti",
    division: "South Chotanagpur",
    verifiedCount: 1,
    hasActivePilot: true,
    leadingHEI: "Birsa Agricultural University",
    partnerCSR: "TRIFED CSR Mission",
    coordinates: { x: 300, y: 360, w: 75, h: 55 },
    activePilots: [
      {
        title: "Lac Micro-Processing & Drone Canopy Telemetry",
        hei: "BAU Agro-Forestry",
        industry: "TRIFED Foundation",
        trl: "Level 3 (Prototype Ready)",
        metrics: "350 tribal gatherers supported",
      },
    ],
  },
  {
    id: "Lohardaga",
    name: "Lohardaga",
    division: "South Chotanagpur",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "Ranchi University",
    partnerCSR: "Hindalco CSR",
    coordinates: { x: 205, y: 245, w: 65, h: 55 },
    activePilots: [
      {
        title: "Bauxite Runoff Water Neutralization Pilot",
        hei: "Ranchi University Chemistry Dept",
        industry: "Hindalco CSR",
        trl: "Level 2 (University Adopted)",
        metrics: "Heavy metal precipitation trials",
      },
    ],
  },
  {
    id: "Simdega",
    name: "Simdega",
    division: "South Chotanagpur",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "BAU Ranchi",
    partnerCSR: "Rural Water Mission",
    coordinates: { x: 175, y: 395, w: 85, h: 70 },
    activePilots: [
      {
        title: "Gravity Check-Dam Lift Micro-Hydel Turbine",
        hei: "BAU Agricultural Engineering",
        industry: "Rural Clean Energy Trust",
        trl: "Level 2 (University Adopted)",
        metrics: "Winter irrigation for 40 hectares",
      },
    ],
  },

  // North Chotanagpur Division
  {
    id: "Dhanbad",
    name: "Dhanbad",
    division: "North Chotanagpur (Coal Capital)",
    verifiedCount: 2,
    hasActivePilot: true,
    leadingHEI: "IIT (ISM) Dhanbad",
    partnerCSR: "Tata Steel CSR & BCCL",
    coordinates: { x: 440, y: 220, w: 75, h: 55 },
    activePilots: [
      {
        title: "Acid Coal Slurry Runoff Neutralization & Water Recovery",
        hei: "IIT (ISM) Dhanbad",
        industry: "Tata Steel Foundation",
        trl: "Level 3 (Prototype Ready)",
        metrics: "Acidity pH 3.8 → 7.1 Safe; 12 villages",
      },
    ],
  },
  {
    id: "Bokaro",
    name: "Bokaro",
    division: "North Chotanagpur",
    verifiedCount: 2,
    hasActivePilot: true,
    leadingHEI: "NIT Jamshedpur",
    partnerCSR: "SAIL Bokaro CSR",
    coordinates: { x: 380, y: 235, w: 65, h: 55 },
    activePilots: [
      {
        title: "Industrial Fly-Ash Sintered Eco-Bricks for Rural Housing",
        hei: "NIT Jamshedpur Civil Dept",
        industry: "Bokaro Steel CSR",
        trl: "Level 4 (Field Testing)",
        metrics: "40% cost reduction; zero clay topsoil",
      },
    ],
  },
  {
    id: "Hazaribagh",
    name: "Hazaribagh",
    division: "North Chotanagpur",
    verifiedCount: 1,
    hasActivePilot: true,
    leadingHEI: "Vinoba Bhave University",
    partnerCSR: "NTPC CSR",
    coordinates: { x: 295, y: 170, w: 80, h: 60 },
    activePilots: [
      {
        title: "Decentralized Solar Cold Chain for Rural Primary Health Clinic",
        hei: "Vinoba Bhave University & BAU",
        industry: "NTPC CSR Mission",
        trl: "Level 3 (Prototype Ready)",
        metrics: "Vaccine temperature compliance 100%",
      },
    ],
  },
  {
    id: "Giridih",
    name: "Giridih",
    division: "North Chotanagpur",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "IIT (ISM) Dhanbad",
    partnerCSR: "State Solar Mission",
    coordinates: { x: 385, y: 150, w: 80, h: 60 },
    activePilots: [
      {
        title: "Mica Mining Tailings Resurfacing & Stabilization",
        hei: "IIT ISM Mining Engineering",
        industry: "Jharkhand Mineral Board",
        trl: "Level 2 (University Adopted)",
        metrics: "Slope stabilization and vegetative cover",
      },
    ],
  },
  {
    id: "Koderma",
    name: "Koderma",
    division: "North Chotanagpur",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "Vinoba Bhave University",
    partnerCSR: "DVC CSR",
    coordinates: { x: 300, y: 105, w: 75, h: 55 },
    activePilots: [
      {
        title: "Tilaiya Reservoir Floating Solar Microgrid Diagnostic",
        hei: "BIT Mesra Electrical Dept",
        industry: "DVC CSR Foundation",
        trl: "Level 2 (University Adopted)",
        metrics: "Surge protection & remote monitoring",
      },
    ],
  },
  {
    id: "Chatra",
    name: "Chatra",
    division: "North Chotanagpur",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "Birsa Agricultural University",
    partnerCSR: "CCL CSR",
    coordinates: { x: 215, y: 145, w: 75, h: 60 },
    activePilots: [
      {
        title: "Forest Produce Bamboo De-Fibering Micro Unit",
        hei: "BAU Rural Technology Lab",
        industry: "CCL CSR Initiative",
        trl: "Level 2 (University Adopted)",
        metrics: "Value addition for 180 artisans",
      },
    ],
  },
  {
    id: "Ramgarh",
    name: "Ramgarh",
    division: "North Chotanagpur",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "BIT Mesra",
    partnerCSR: "Jindal Steel CSR",
    coordinates: { x: 340, y: 225, w: 55, h: 45 },
    activePilots: [
      {
        title: "Mine Effluent Water Recovery for Irrigation",
        hei: "BIT Mesra Environmental Cell",
        industry: "Jindal CSR",
        trl: "Level 2 (University Adopted)",
        metrics: "Safe turbidity & pH restoration",
      },
    ],
  },

  // Kolhan Division
  {
    id: "East Singhbhum",
    name: "East Singhbhum",
    division: "Kolhan (Jamshedpur Industrial Hub)",
    verifiedCount: 2,
    hasActivePilot: true,
    leadingHEI: "NIT Jamshedpur",
    partnerCSR: "Tata Steel Foundation",
    coordinates: { x: 440, y: 365, w: 85, h: 65 },
    activePilots: [
      {
        title: "Smart IoT Surge-Resilient Hybrid Microgrid Inverter",
        hei: "NIT Jamshedpur (Urja-Vikas Hub)",
        industry: "Tata Steel CSR",
        trl: "Level 2 (University Adopted)",
        metrics: "Lightning surge suppression architecture",
      },
      {
        title: "Slag Paving Resilient Rural Road Culvert",
        hei: "NIT Jamshedpur Civil Lab",
        industry: "Tata Steel CSR",
        trl: "Level 4 (Field Testing)",
        metrics: "Flood-resistant rural road connectivity",
      },
    ],
  },
  {
    id: "West Singhbhum",
    name: "West Singhbhum",
    division: "Kolhan",
    verifiedCount: 1,
    hasActivePilot: true,
    leadingHEI: "Kolhan University & BAU",
    partnerCSR: "Tata Steel CSR (Noamundi)",
    coordinates: { x: 320, y: 415, w: 100, h: 80 },
    activePilots: [
      {
        title: "Chironji & Mahua Solar Vacuum Dryer for Tribal SHGs",
        hei: "Kolhan University Botany Dept",
        industry: "Tata Steel Foundation",
        trl: "Level 3 (Prototype Ready)",
        metrics: "40% shelf life extension; no aflatoxins",
      },
    ],
  },
  {
    id: "Saraikela Kharsawan",
    name: "Saraikela Kharsawan",
    division: "Kolhan",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "NIT Jamshedpur",
    partnerCSR: "Adhunik CSR",
    coordinates: { x: 380, y: 350, w: 70, h: 55 },
    activePilots: [
      {
        title: "Tasar Silk Solar Reeling Machine for Women Weavers",
        hei: "NIT Jamshedpur Mechanical Dept",
        industry: "Sericulture Mission",
        trl: "Level 2 (University Adopted)",
        metrics: "+30% thread tensile strength",
      },
    ],
  },

  // Palamu Division
  {
    id: "Palamu",
    name: "Palamu",
    division: "Palamu",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "Nilamber-Pitamber University",
    partnerCSR: "State Water Resource Dept",
    coordinates: { x: 135, y: 130, w: 80, h: 60 },
    activePilots: [
      {
        title: "Drought-Resilient Pearl Millet & Micro-Irrigation Check-Dams",
        hei: "Nilamber-Pitamber Univ & BAU",
        industry: "NABARD CSR",
        trl: "Level 2 (University Adopted)",
        metrics: "Water efficiency +60% in rainfed areas",
      },
    ],
  },
  {
    id: "Garhwa",
    name: "Garhwa",
    division: "Palamu",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "Nilamber-Pitamber University",
    partnerCSR: "District Innovation Fund",
    coordinates: { x: 65, y: 110, w: 75, h: 65 },
    activePilots: [
      {
        title: "North Koel River Solar Lift Irrigation Module",
        hei: "BAU Agri-Engineering",
        industry: "State Irrigation Dept",
        trl: "Level 1 (Ground Verified)",
        metrics: "Low-head solar pump for 250 farmers",
      },
    ],
  },
  {
    id: "Latehar",
    name: "Latehar",
    division: "Palamu",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "Ranchi University",
    partnerCSR: "Forest Department CSR",
    coordinates: { x: 170, y: 195, w: 75, h: 60 },
    activePilots: [
      {
        title: "Off-Grid Tribal Hamlet Solar Microgrid Kiosks",
        hei: "BIT Mesra Electrical Dept",
        industry: "CleanTech Foundation",
        trl: "Level 2 (University Adopted)",
        metrics: "Safe night illumination for 90 homes",
      },
    ],
  },

  // Santhal Pargana Division
  {
    id: "Deoghar",
    name: "Deoghar",
    division: "Santhal Pargana",
    verifiedCount: 1,
    hasActivePilot: true,
    leadingHEI: "AIIMS Deoghar & BIT Deoghar",
    partnerCSR: "State Tourism Mission",
    coordinates: { x: 440, y: 130, w: 70, h: 55 },
    activePilots: [
      {
        title: "Pilgrim Organic Flower Waste Bio-Methanation & Briquetting",
        hei: "BIT Deoghar Campus",
        industry: "Deoghar Municipal Corp",
        trl: "Level 3 (Prototype Ready)",
        metrics: "1.2 Tons waste processed into clean fuel",
      },
    ],
  },
  {
    id: "Dumka",
    name: "Dumka",
    division: "Santhal Pargana (Sub-Capital)",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "Sido Kanhu Murmu University",
    partnerCSR: "State Tribal Welfare Dept",
    coordinates: { x: 505, y: 135, w: 70, h: 60 },
    activePilots: [
      {
        title: "Santhal Herbal Medicine Standardized Packaging Unit",
        hei: "SKMU Botany Dept",
        industry: "TRIFED Foundation",
        trl: "Level 2 (University Adopted)",
        metrics: "Microbial purity test compliance",
      },
    ],
  },
  {
    id: "Godda",
    name: "Godda",
    division: "Santhal Pargana",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "SKMU Dumka",
    partnerCSR: "Adani Power CSR",
    coordinates: { x: 505, y: 75, w: 65, h: 55 },
    activePilots: [
      {
        title: "Decentralized Mango & Litchi Solar Cold Room",
        hei: "BAU Regional Research Station",
        industry: "Adani Foundation",
        trl: "Level 2 (University Adopted)",
        metrics: "Post-harvest rot reduction 40%",
      },
    ],
  },
  {
    id: "Sahibganj",
    name: "Sahibganj",
    division: "Santhal Pargana (Ganges Port)",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "SKMU Dumka",
    partnerCSR: "Inland Waterways Authority",
    coordinates: { x: 565, y: 70, w: 65, h: 55 },
    activePilots: [
      {
        title: "Ganga Silt Sedimentation Tile Manufacturing",
        hei: "IIT ISM Dhanbad Civil Dept",
        industry: "Riverine Eco CSR",
        trl: "Level 1 (Ground Verified)",
        metrics: "Low-cost river silt bricks",
      },
    ],
  },
  {
    id: "Pakur",
    name: "Pakur",
    division: "Santhal Pargana",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "SKMU Dumka",
    partnerCSR: "Stone Crusher Association",
    coordinates: { x: 560, y: 130, w: 65, h: 55 },
    activePilots: [
      {
        title: "Automated Water Misting Dust Suppressor for Stone Crushers",
        hei: "IIT ISM Dhanbad Mining Lab",
        industry: "Pakur Industrial Welfare",
        trl: "Level 2 (University Adopted)",
        metrics: "PM10 particulate reduction 70%",
      },
    ],
  },
  {
    id: "Jamtara",
    name: "Jamtara",
    division: "Santhal Pargana",
    verifiedCount: 1,
    hasActivePilot: false,
    leadingHEI: "SKMU Dumka",
    partnerCSR: "Digital Literacy Trust",
    coordinates: { x: 470, y: 190, w: 65, h: 50 },
    activePilots: [
      {
        title: "Village Solar Citizen Grievance Touch Kiosks",
        hei: "BIT Mesra Computer Science",
        industry: "Digital India Mission",
        trl: "Level 2 (University Adopted)",
        metrics: "Voice-enabled Hindi & Santhali grievance logging",
      },
    ],
  },
];

export default function JharkhandDistrictMap({
  selectedDistrict = "All",
  onSelectDistrict,
  onFilterChallenges,
  problemsCountByDistrict = {},
}) {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  // Active district details (default to Gumla for SIH vertical slice if 'All' or selected)
  const currentDistrictObj =
    JHARKHAND_DISTRICTS_DATA.find(
      (d) => d.id.toLowerCase() === (selectedDistrict === "All" ? "gumla" : selectedDistrict.toLowerCase())
    ) || JHARKHAND_DISTRICTS_DATA[0];

  const handleDistrictClick = (districtId) => {
    if (onSelectDistrict) {
      onSelectDistrict(districtId);
    }
  };

  return (
    <div className="jharkhand-map-container">
      {/* Header */}
      <div className="jharkhand-map-header">
        <div className="map-header-left">
          <div className="map-badge-icon">
            <MapPin size={20} />
          </div>
          <div>
            <div className="map-eyebrow-row">
              <span className="map-eyebrow">GEO-SPATIAL CITIZEN ATLAS</span>
              <span className="map-all-badge">24 Districts Covered</span>
            </div>
            <h3 className="map-title">Interactive Jharkhand District Innovation Map</h3>
            <p className="map-subtitle">
              Click any district (e.g. <strong>Gumla</strong>, <strong>Ranchi</strong>, <strong>Dhanbad</strong>, <strong>East Singhbhum</strong>) to filter problems and explore active University-Industry pilots.
            </p>
          </div>
        </div>

        {/* Quick District Switcher Pill Row */}
        <div className="map-quick-districts">
          <button
            type="button"
            className={`map-chip-btn ${selectedDistrict === "All" ? "active" : ""}`}
            onClick={() => onSelectDistrict && onSelectDistrict("All")}
          >
            Show All 24 Districts
          </button>
          {["Gumla", "Ranchi", "Dhanbad", "East Singhbhum"].map((dName) => (
            <button
              key={dName}
              type="button"
              className={`map-chip-btn ${
                selectedDistrict.toLowerCase() === dName.toLowerCase() ? "active" : ""
              }`}
              onClick={() => handleDistrictClick(dName)}
            >
              📍 {dName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Spotlight Split View */}
      <div className="jharkhand-map-body-split">
        {/* SVG Interactive Canvas */}
        <div className="map-svg-canvas-wrap">
          <div className="map-canvas-watermark">
            JHARKHAND · 24 DISTRICTS
          </div>

          <svg
            viewBox="50 60 590 450"
            className="jharkhand-svg-map"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Soft state boundary background glow */}
            <path
              d="M 60,110 L 150,70 L 300,95 L 430,70 L 580,65 L 635,120 L 590,200 L 525,230 L 530,370 L 460,440 L 320,500 L 220,470 L 160,400 L 180,310 L 120,230 L 60,180 Z"
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />

            {/* Render 24 Districts as Interactive Regional Geo-Blocks */}
            {JHARKHAND_DISTRICTS_DATA.map((district) => {
              const isSelected =
                selectedDistrict.toLowerCase() === district.id.toLowerCase() ||
                (selectedDistrict === "All" && district.id === "Gumla");
              const isHovered = hoveredDistrict?.id === district.id;
              const hasPilot = district.hasActivePilot;
              const count = problemsCountByDistrict[district.id] || district.verifiedCount;

              const { x, y, w, h } = district.coordinates;

              return (
                <g
                  key={district.id}
                  className={`district-geo-group ${isSelected ? "selected" : ""} ${
                    isHovered ? "hovered" : ""
                  }`}
                  onClick={() => handleDistrictClick(district.id)}
                  onMouseEnter={() => setHoveredDistrict(district)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                >
                  {/* Rounded polygon district tile */}
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx="10"
                    className={`district-tile-rect ${
                      isSelected ? "is-selected" : hasPilot ? "has-pilot" : ""
                    }`}
                  />

                  {/* Pulsing Pilot Indicator Ring */}
                  {hasPilot && (
                    <circle
                      cx={x + w - 12}
                      cy={y + 12}
                      r="4.5"
                      className="pilot-pulse-circle"
                    />
                  )}

                  {/* District Name Label */}
                  <text
                    x={x + w / 2}
                    y={y + h / 2 - 2}
                    textAnchor="middle"
                    className="district-label-text"
                  >
                    {district.name}
                  </text>

                  {/* Problem Count Badge */}
                  <g transform={`translate(${x + w / 2 - 12}, ${y + h / 2 + 8})`}>
                    <rect
                      width="24"
                      height="14"
                      rx="7"
                      className={`district-count-pill ${isSelected ? "selected" : ""}`}
                    />
                    <text
                      x="12"
                      y="10.5"
                      textAnchor="middle"
                      className="district-count-text"
                    >
                      {count}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Map Legend */}
          <div className="map-legend-bar">
            <div className="legend-item">
              <span className="legend-dot active-pilot" />
              <span>Active University-Industry Pilot (TRL 1-5)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot standard" />
              <span>Ground Verified Challenge Queue</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot selected" />
              <span>Currently Filtered District</span>
            </div>
          </div>
        </div>

        {/* District Innovation Spotlight Card */}
        <div className="district-spotlight-card">
          <div className="spotlight-header">
            <div className="spotlight-title-group">
              <span className="spotlight-eyebrow">
                <MapPin size={13} color="#059669" />
                {currentDistrictObj.division}
              </span>
              <h2>{currentDistrictObj.name} District</h2>
            </div>

            <div className="spotlight-count-box">
              <span className="count-num">
                {problemsCountByDistrict[currentDistrictObj.id] || currentDistrictObj.verifiedCount}
              </span>
              <span className="count-desc">Verified Challenges</span>
            </div>
          </div>

          <div className="spotlight-stakeholders-strip">
            <div className="stakeholder-tag hei">
              <GraduationCap size={15} />
              <div>
                <span>Primary Academic Lab</span>
                <strong>{currentDistrictObj.leadingHEI}</strong>
              </div>
            </div>

            <div className="stakeholder-tag csr">
              <Building2 size={15} />
              <div>
                <span>Active CSR Sponsor</span>
                <strong>{currentDistrictObj.partnerCSR}</strong>
              </div>
            </div>
          </div>

          {/* Active Pilots in this District */}
          <div className="spotlight-pilots-section">
            <div className="pilots-header">
              <Activity size={15} color="#2563eb" />
              <h4>Active Quad-Helix Pilots in {currentDistrictObj.name}:</h4>
            </div>

            <div className="pilots-cards-list">
              {currentDistrictObj.activePilots.map((pilot, idx) => (
                <div key={idx} className="pilot-mini-card">
                  <div className="pilot-mini-top">
                    <span className="pilot-trl-tag">{pilot.trl}</span>
                    <span className="pilot-metrics-chip">
                      <Sparkles size={11} />
                      {pilot.metrics}
                    </span>
                  </div>
                  <h5 className="pilot-mini-title">{pilot.title}</h5>
                  <div className="pilot-mini-partners">
                    <span>
                      <strong>HEI:</strong> {pilot.hei}
                    </span>
                    <span>
                      <strong>CSR:</strong> {pilot.industry}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter CTA Button */}
          <div className="spotlight-actions-row">
            <button
              type="button"
              className="btn-filter-district-challenges"
              onClick={() => {
                if (onFilterChallenges) {
                  onFilterChallenges(currentDistrictObj.id);
                } else if (onSelectDistrict) {
                  onSelectDistrict(currentDistrictObj.id);
                }
              }}
            >
              <Filter size={15} />
              <span>
                Filter {currentDistrictObj.name} Challenges ({currentDistrictObj.verifiedCount})
              </span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
