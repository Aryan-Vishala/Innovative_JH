import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Building2,
  Landmark,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  List,
  MapPin,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  Activity,
  Layers,
  Award,
  Zap,
  BarChart2,
  ExternalLink,
} from "lucide-react";
import { problemApi } from "../../services/api";
import JharkhandDistrictMap from "../../components/map/JharkhandDistrictMap";
import TrlProgressTracker from "../../components/problems/TrlProgressTracker";
import "./PublicBoard.css";

// 5 Standard Innovation Levels
const INNOVATION_LEVELS = [
  {
    level: 1,
    tag: "Verified",
    title: "Ground Verified",
    subtitle: "Validated by Local PRI / ULB",
    description: "Physical on-site inspection completed. Baseline data, photographs, and citizen grievance validated as genuine.",
    badgeClass: "level-tag-1",
    statusClass: "level-status-1",
    color: "#0284c7",
  },
  {
    level: 2,
    tag: "University Adopted",
    title: "Adopted by University",
    subtitle: "Assigned to HEI Research Cell",
    description: "Evaluated by State Nodal Board and officially adopted by university faculty & student engineering teams.",
    badgeClass: "level-tag-2",
    statusClass: "level-status-2",
    color: "#7c3aed",
  },
  {
    level: 3,
    tag: "Prototype Created",
    title: "Solution Prototype Ready",
    subtitle: "Lab & Hardware Validation",
    description: "Working physical or digital solution prototype designed, built, and bench-tested in university labs.",
    badgeClass: "level-tag-3",
    statusClass: "level-status-3",
    color: "#d97706",
  },
  {
    level: 4,
    tag: "Field Testing",
    title: "Pilot Field Testing",
    subtitle: "Live Ground Validation",
    description: "Solution deployed in real community conditions for pilot trials, safety certification, and user feedback.",
    badgeClass: "level-tag-4",
    statusClass: "level-status-4",
    color: "#0f766e",
  },
  {
    level: 5,
    tag: "Deployed Solution",
    title: "Operational Deployment",
    subtitle: "Final Verified Ground Impact",
    description: "Fully commissioned and operational solution actively serving citizens, with maintenance transferred to local body.",
    badgeClass: "level-tag-5",
    statusClass: "level-status-5",
    color: "#059669",
  },
];

// Fallback Curated Dataset for instant rendering & offline resilience
const FALLBACK_PROBLEMS = [
  {
    _id: "seed-1",
    problemId: "JH-000001",
    title: "Groundwater contamination and high fluoride levels in drinking wells",
    description:
      "Several hand pumps and borewells in Kamdara village produced water with fluoride content reaching 2.4 PPM, causing joint stiffness and fluorosis among villagers.",
    category: "Water Management",
    location: { district: "Gumla", block: "Kamdara", village: "Kamdara North" },
    impact: { estimatedPopulation: 1250, citizenReportedSeverity: "High" },
    status: "DEPLOYED",
    createdAt: "2026-08-15T10:00:00.000Z",
    solution: {
      universityName: "BIT Mesra, Ranchi",
      teamName: "Jal-Shuddhi Innovation Team",
      solutionTitle: "Solar-Powered Activated Alumina Fluoride Adsorption Plant",
      solutionSummary:
        "Off-grid decentralized 300W solar adsorption unit providing 4,000 L/day of pure water meeting BIS 10500 standards.",
      level: 5,
      levelTag: "Deployed Solution",
      impactOutcome: "Test fluoride reduced from 2.4 PPM to 0.35 PPM; serving 1,250 residents continuously.",
    },
    timeline: [
      { stage: "SUBMITTED", description: "Problem reported by citizen from Kamdara North.", updaterName: "Citizen", timestamp: "2026-08-12T09:00:00.000Z" },
      { stage: "PRI_VERIFIED", description: "Panchayat ground inspection verified fluoride > 2.4 PPM.", updaterName: "Mukhiya Sanjay Oraon", timestamp: "2026-08-18T11:00:00.000Z" },
      { stage: "NODAL_REVIEWED", description: "Selected for state challenge and adopted by BIT Mesra.", updaterName: "State Nodal Cell", timestamp: "2026-08-25T14:00:00.000Z" },
      { stage: "PROTOTYPE_READY", description: "Solar adsorption unit fabrication and lab testing completed.", updaterName: "BIT Mesra Lab", timestamp: "2026-09-05T16:00:00.000Z" },
      { stage: "PILOT_TESTING", description: "14-day field pilot achieved 100% water quality compliance.", updaterName: "District Mission", timestamp: "2026-09-18T10:00:00.000Z" },
      { stage: "DEPLOYED", description: "Full plant commissioned on site; handed over to village Pani Samiti.", updaterName: "State Innovation Mission", timestamp: "2026-09-24T12:00:00.000Z" },
    ],
  },
  {
    _id: "seed-6",
    problemId: "JH-000006",
    title: "Open storm-water drain overflow creating urban mosquito vector hazard",
    description:
      "Stagnant runoff overflows onto streets during rain bursts, triggering recurring dengue and malaria cases among 2,200 urban colony residents.",
    category: "Urban Infrastructure",
    location: { district: "Ranchi", block: "Ranchi Urban", village: "Harmu Housing Colony" },
    impact: { estimatedPopulation: 2200, citizenReportedSeverity: "Critical" },
    status: "DEPLOYED",
    createdAt: "2026-08-01T08:00:00.000Z",
    solution: {
      universityName: "BIT Lalpur & RIMS Community Medicine",
      teamName: "Urban Eco-Shield",
      solutionTitle: "Modular Bio-Enzymatic Silt Trap & Larvicidal Floating Vegetation Mat",
      solutionSummary:
        "Natural enzyme dosing pods and vetiver wetland mats that digest sludge and eliminate mosquito breeding without toxic chemicals.",
      level: 5,
      levelTag: "Deployed Solution",
      impactOutcome: "Zero overflow incidents recorded; vector larvae counts dropped 94% across 800m channel.",
    },
    timeline: [
      { stage: "SUBMITTED", description: "Reported by Harmu Citizens Welfare Association.", updaterName: "Citizen", timestamp: "2026-07-25T10:00:00.000Z" },
      { stage: "PRI_VERIFIED", description: "Ranchi Municipal Corporation engineer verified critical choke point.", updaterName: "RMC Urban Inspector", timestamp: "2026-08-04T12:00:00.000Z" },
      { stage: "NODAL_REVIEWED", description: "Adopted under Urban Resilience initiative by BIT Lalpur team.", updaterName: "Urban Nodal Cell", timestamp: "2026-08-16T15:00:00.000Z" },
      { stage: "DEPLOYED", description: "Bio-filtration mats and enzyme pods installed and functioning on site.", updaterName: "RMC & BIT Lalpur", timestamp: "2026-09-12T11:00:00.000Z" },
    ],
  },
  {
    _id: "seed-2",
    problemId: "JH-000002",
    title: "Soil erosion and heavy siltation blocking irrigation check-dam",
    description:
      "Monsoon sediment washed into the check-dam, reducing storage capacity by 60% and depriving 120 smallholder farming families of winter irrigation.",
    category: "Agriculture",
    location: { district: "Gumla", block: "Kamdara", village: "Barigaon" },
    impact: { estimatedPopulation: 600, citizenReportedSeverity: "Medium" },
    status: "PILOT_TESTING",
    createdAt: "2026-08-20T11:00:00.000Z",
    solution: {
      universityName: "Birsa Agricultural University (BAU)",
      teamName: "Krishi-Setu Lab",
      solutionTitle: "Vetiver Bio-Engineering Barrier & Automated Silt Gate Release Mechanism",
      solutionSummary:
        "Deep-root vetiver bio-bunding on upstream slopes combined with a weighted buoyancy sluice gate that purges sediment automatically.",
      level: 4,
      levelTag: "Field Testing",
      impactOutcome: "Reservoir storage restored by 45% during pre-monsoon trials; 70 farmers participating in live test.",
    },
    timeline: [
      { stage: "SUBMITTED", description: "Reported by citizen from Barigaon.", updaterName: "Citizen", timestamp: "2026-08-20T09:00:00.000Z" },
      { stage: "PRI_VERIFIED", description: "PRI ground inspection confirmed 1.8m sediment buildup.", updaterName: "Mukhiya Sanjay Oraon", timestamp: "2026-08-27T14:00:00.000Z" },
      { stage: "NODAL_REVIEWED", description: "Assigned to Birsa Agricultural University Agro-Engineering Dept.", updaterName: "State Nodal Cell", timestamp: "2026-09-02T10:00:00.000Z" },
      { stage: "PILOT_TESTING", description: "Experimental bio-bunds and automated gate installed for field testing.", updaterName: "BAU Agro-Tech Lab", timestamp: "2026-09-20T16:00:00.000Z" },
    ],
  },
  {
    _id: "seed-3",
    problemId: "JH-000003",
    title: "Severe arsenic & iron traces in primary school tube-well",
    description:
      "Water from the school tube-well exhibits reddish precipitate with iron > 3.0 mg/L, affecting safe drinking water and mid-day meals for 240 students.",
    category: "Healthcare",
    location: { district: "Gumla", block: "Kamdara", village: "Kamdara Central" },
    impact: { estimatedPopulation: 450, citizenReportedSeverity: "Critical" },
    status: "PROTOTYPE_READY",
    createdAt: "2026-09-01T09:00:00.000Z",
    solution: {
      universityName: "IIT (ISM) Dhanbad",
      teamName: "CleanWater Innovators",
      solutionTitle: "Zero-Electricity Multi-Stage Sand & Iron-Oxide Adsorption Column",
      solutionSummary:
        "Gravity-fed filtration utilizing zero-valent iron shavings and quartz sand to bring iron levels < 0.3 mg/L with zero electric power.",
      level: 3,
      levelTag: "Prototype Created",
      impactOutcome: "Bench prototype achieved 96.8% iron removal and turbidity clearance; field trial pending.",
    },
    timeline: [
      { stage: "SUBMITTED", description: "Reported by school committee.", updaterName: "Citizen", timestamp: "2026-09-01T09:00:00.000Z" },
      { stage: "PRI_VERIFIED", description: "Panchayat confirmed iron levels exceeding safe limits.", updaterName: "PRI Mukhiya", timestamp: "2026-09-07T12:00:00.000Z" },
      { stage: "NODAL_REVIEWED", description: "Classified as Critical Healthcare Challenge; assigned to IIT Dhanbad.", updaterName: "State Nodal Cell", timestamp: "2026-09-12T15:00:00.000Z" },
      { stage: "PROTOTYPE_READY", description: "Zero-power filter prototype completed bench test with 96.8% clearance.", updaterName: "IIT Dhanbad Lab", timestamp: "2026-09-23T11:00:00.000Z" },
    ],
  },
  {
    _id: "seed-4",
    problemId: "JH-000004",
    title: "Non-functional Solar Micro-grid and street lighting in rural tribal hamlet",
    description:
      "Battery inverters in village solar micro-grid failed after lightning surges, leaving 85 tribal households without electricity and road lighting.",
    category: "Energy",
    location: { district: "Gumla", block: "Kamdara", village: "Belsiyari" },
    impact: { estimatedPopulation: 380, citizenReportedSeverity: "High" },
    status: "MASTER_PROBLEM_CREATED",
    createdAt: "2026-09-05T14:00:00.000Z",
    solution: {
      universityName: "NIT Jamshedpur",
      teamName: "Urja-Vikas Hub",
      solutionTitle: "Smart IoT Surge-Resilient Hybrid Micro-Grid Inverter with Battery Balancer",
      solutionSummary:
        "Ruggedized inverter with optical isolation and multi-stage metal oxide varistor suppressors designed for lightning-prone terrains.",
      level: 2,
      levelTag: "University Adopted",
      impactOutcome: "Adopted by 4 PG researchers; hardware schematic finalized and components ordered.",
    },
    timeline: [
      { stage: "SUBMITTED", description: "Reported by hamlet representative.", updaterName: "Citizen", timestamp: "2026-09-05T14:00:00.000Z" },
      { stage: "PRI_VERIFIED", description: "Verified fried inverters from lightning surge.", updaterName: "Local PRI", timestamp: "2026-09-10T11:00:00.000Z" },
      { stage: "NODAL_REVIEWED", description: "Adopted by NIT Jamshedpur Renewable Energy Cell.", updaterName: "State Nodal Cell", timestamp: "2026-09-17T16:00:00.000Z" },
    ],
  },
  {
    _id: "seed-5",
    problemId: "JH-000005",
    title: "Lack of temperature-controlled storage causing post-harvest decay of Lac & Mahua",
    description:
      "Over 400 tribal forest produce gatherers lose 30-40% of their harvest due to humidity fungus and lack of decentralized solar cold storage.",
    category: "Environment",
    location: { district: "Ranchi", block: "Angara", village: "Getalsud East" },
    impact: { estimatedPopulation: 850, citizenReportedSeverity: "High" },
    status: "PRI_VERIFIED",
    createdAt: "2026-09-10T10:00:00.000Z",
    solution: {
      universityName: "Ranchi University & ICAR-IINRG",
      teamName: "Tribal Livelihood Taskforce",
      solutionTitle: "Phase Change Material (PCM) Solar Cold Micro-Storage Unit",
      solutionSummary:
        "Verified civic grievance published to state universities for developing passive thermal cold preservation units.",
      level: 1,
      levelTag: "Verified",
      impactOutcome: "Grievance verified on ground; problem challenge opened to 47 state institutions.",
    },
    timeline: [
      { stage: "SUBMITTED", description: "Reported by forest produce gatherers cooperative.", updaterName: "Citizen Submitter", timestamp: "2026-09-10T10:00:00.000Z" },
      { stage: "PRI_VERIFIED", description: "Panchayat Mukhiya physically inspected post-harvest fungal loss.", updaterName: "Getalsud Mukhiya", timestamp: "2026-09-15T13:00:00.000Z" },
    ],
  },
];

function PublicBoard() {
  const navigate = useNavigate();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all"); // 'all', 1, 2, 3, 4, 5
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");

  // Pagination & Display Limit State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); // Display 4 problems per page so page doesn't get flooded
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'compact'

  // API Data State
  const [problems, setProblems] = useState(FALLBACK_PROBLEMS);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Selected Problem Modal State
  const [activeModalProblem, setActiveModalProblem] = useState(null);

  // 1. Fetch live analytics & problem statements
  useEffect(() => {
    let isMounted = true;
    const loadPublicData = async () => {
      setLoading(true);
      try {
        // Fetch public stats
        const statsRes = await problemApi.getPublicAnalytics().catch(() => null);
        if (statsRes?.data && isMounted) {
          setAnalytics(statsRes.data);
        }

        // Fetch verified problem statements
        const problemsRes = await problemApi
          .getAll({ verifiedOnly: "true", limit: 50 })
          .catch(() => null);

        if (problemsRes?.data && problemsRes.data.length > 0 && isMounted) {
          setProblems(problemsRes.data);
        }
      } catch (err) {
        console.warn("Using fallback data for public board:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPublicData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reset to page 1 whenever filters, search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLevel, selectedCategory, selectedDistrict, pageSize]);

  // Compute Live or Fallback KPI figures
  const kpis = useMemo(() => {
    if (analytics?.kpis) {
      return {
        totalReported: analytics.kpis.totalReported || 1248,
        verified: analytics.kpis.verified || problems.length,
        universityAdopted: analytics.kpis.universityAdopted || 312,
        prototypeReady: analytics.kpis.prototypeReady || 148,
        deployed: analytics.kpis.deployed || 56,
        beneficiaries: analytics.kpis.totalBeneficiaries || 185000,
      };
    }

    // Calculated from loaded problems
    const deployed = problems.filter((p) => p.solution?.level === 5 || p.status === "DEPLOYED").length;
    const proto = problems.filter((p) => (p.solution?.level || 0) >= 3).length;
    const adopted = problems.filter((p) => (p.solution?.level || 0) >= 2).length;
    const totalPop = problems.reduce((acc, p) => acc + (p.impact?.estimatedPopulation || 0), 0);

    return {
      totalReported: 1420,
      verified: problems.length || 6,
      universityAdopted: adopted || 4,
      prototypeReady: proto || 3,
      deployed: deployed || 2,
      beneficiaries: totalPop > 0 ? totalPop : 5730,
    };
  }, [analytics, problems]);

  // Available unique districts & categories for filter dropdowns
  const categoriesList = useMemo(() => {
    const set = new Set(problems.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [problems]);

  const districtsList = useMemo(() => {
    const set = new Set(problems.map((p) => p.location?.district).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [problems]);

  // Problem counts mapped by district for the 24-district map
  const problemsCountByDistrict = useMemo(() => {
    const counts = {};
    problems.forEach((p) => {
      const dist = p.location?.district;
      if (dist) {
        counts[dist] = (counts[dist] || 0) + 1;
      }
    });
    return counts;
  }, [problems]);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return problems.filter((item) => {
      // Level filter
      if (selectedLevel !== "all") {
        const itemLevel = item.solution?.level || 1;
        if (itemLevel !== Number(selectedLevel)) return false;
      }

      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // District filter
      if (selectedDistrict !== "All" && item.location?.district !== selectedDistrict) {
        return false;
      }

      // Search query (matches problemId, title, description, district, block, or university)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = item.problemId?.toLowerCase().includes(q);
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesDistrict = item.location?.district?.toLowerCase().includes(q);
        const matchesBlock = item.location?.block?.toLowerCase().includes(q);
        const matchesUni = item.solution?.universityName?.toLowerCase().includes(q);
        const matchesSol = item.solution?.solutionTitle?.toLowerCase().includes(q);

        if (
          !matchesId &&
          !matchesTitle &&
          !matchesDesc &&
          !matchesDistrict &&
          !matchesBlock &&
          !matchesUni &&
          !matchesSol
        ) {
          return false;
        }
      }

      return true;
    });
  }, [problems, selectedLevel, selectedCategory, selectedDistrict, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProblems = filteredProblems.slice(startIndex, startIndex + pageSize);

  // Programmatic offset-aware scrolling for sticky navbar
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (sectionId === "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      const navOffset = 84;
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: "smooth",
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const target = document.getElementById("problems-showcase");
    if (target) {
      const navOffset = 84;
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: "smooth",
      });
    }
  };

  // Quick lookup handler for the hero search bar
  const handleHeroSearch = (e) => {
    e.preventDefault();
    const target = document.getElementById("problems-showcase");
    if (target) {
      const navOffset = 84;
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: "smooth",
      });
    }
  };

  const handleQuickTagClick = (tag) => {
    setSearchQuery(tag);
    const target = document.getElementById("problems-showcase");
    if (target) {
      const navOffset = 84;
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="public-portal">
      {/* =====================================================
          STICKY TOP NAVBAR
      ===================================================== */}
      <header className="portal-navbar">
        <div className="portal-nav-inner">
          <Link to="/" className="portal-brand">
            <div className="portal-logo-mark">IJ</div>
            <div className="portal-brand-text">
              <strong>INNOVATIVE JHARKHAND</strong>
              <span>Public Transparency Board</span>
            </div>
          </Link>

          <nav className="portal-nav-links">
            <a
              href="#district-map-section"
              className="nav-link"
              onClick={(e) => handleNavClick(e, "district-map-section")}
            >
              🗺️ 24-District Map
            </a>
            <a
              href="#innovation-stages"
              className="nav-link"
              onClick={(e) => handleNavClick(e, "innovation-stages")}
            >
              TRL Stepper
            </a>
            <a
              href="#analytics-breakdown"
              className="nav-link"
              onClick={(e) => handleNavClick(e, "analytics-breakdown")}
            >
              State Analytics
            </a>
            <a
              href="#problems-showcase"
              className="nav-link"
              onClick={(e) => handleNavClick(e, "problems-showcase")}
            >
              Problem Tracker
            </a>
          </nav>

          <div className="portal-nav-actions">
            <Link to="/auth?mode=register&role=citizen" className="btn-report">
              Report a Problem
            </Link>
            <Link to="/auth?mode=login" className="btn-login">
              Portal Login
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO BANNER & INSTANT TRACKER SEARCH
      ===================================================== */}
      <section id="overview" className="portal-hero">
        <div className="portal-hero-bg-pattern"></div>
        <div className="portal-hero-inner">
          <div className="portal-eyebrow">
            <ShieldCheck size={14} />
            GOVERNMENT OF JHARKHAND · CITIZEN TRANSPARENCY & INNOVATION ENGINE
          </div>

          <h1>
            Track Real Ground Problems to{" "}
            <span className="highlight">Deployed Solutions</span>
          </h1>

          <p className="hero-subtext">
            Common citizens can openly monitor every civic challenge from physical ground verification by local
            Mukhiyas/ULBs, to university research adoption, prototype testing, and full field deployment across Jharkhand.
          </p>

          {/* Quick Problem ID Tracker Form */}
          <form className="hero-tracker-bar" onSubmit={handleHeroSearch}>
            <Search size={19} />
            <input
              type="text"
              placeholder="Enter Problem ID (e.g. JH-000001), district, or keyword to track live status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              Track Progress <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="hero-quick-tags">
            <span className="quick-tag-label">Popular Searches:</span>
            <button type="button" className="quick-tag-btn" onClick={() => handleQuickTagClick("JH-000001")}>
              #JH-000001
            </button>
            <button type="button" className="quick-tag-btn" onClick={() => handleQuickTagClick("Gumla")}>
              Gumla District
            </button>
            <button type="button" className="quick-tag-btn" onClick={() => handleQuickTagClick("Water Management")}>
              Water Filtration
            </button>
            <button type="button" className="quick-tag-btn" onClick={() => handleQuickTagClick("BIT Mesra")}>
              BIT Mesra Solutions
            </button>
            <button type="button" className="quick-tag-btn" onClick={() => setSelectedLevel(5)}>
              ✨ Deployed Solutions Only
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          KPI SUMMARY CARDS
      ===================================================== */}
      <section id="kpis-section" className="portal-kpi-section">
        <div className="kpi-cards-grid">
          {/* 1. Total Problems */}
          <div className="kpi-card kpi-total">
            <div className="kpi-top">
              <div className="kpi-icon-wrap">
                <AlertTriangle size={20} />
              </div>
              <span className="kpi-badge">State Wide</span>
            </div>
            <div className="kpi-value">{kpis.totalReported.toLocaleString()}</div>
            <div className="kpi-label">Grievances Reported</div>
            <div className="kpi-desc">Across all 24 Jharkhand districts</div>
          </div>

          {/* 2. Ground Verified */}
          <div className="kpi-card kpi-verified">
            <div className="kpi-top">
              <div className="kpi-icon-wrap">
                <CheckCircle2 size={20} />
              </div>
              <span className="kpi-badge">Level 1</span>
            </div>
            <div className="kpi-value">{kpis.verified}</div>
            <div className="kpi-label">Ground Verified</div>
            <div className="kpi-desc">Physically inspected by PRI / ULB</div>
          </div>

          {/* 3. University Adopted */}
          <div className="kpi-card kpi-adopted">
            <div className="kpi-top">
              <div className="kpi-icon-wrap">
                <GraduationCap size={20} />
              </div>
              <span className="kpi-badge">Level 2</span>
            </div>
            <div className="kpi-value">{kpis.universityAdopted}</div>
            <div className="kpi-label">University Adopted</div>
            <div className="kpi-desc">Selected for HEI research & solve</div>
          </div>

          {/* 4. Prototype Created */}
          <div className="kpi-card kpi-prototype">
            <div className="kpi-top">
              <div className="kpi-icon-wrap">
                <Zap size={20} />
              </div>
              <span className="kpi-badge">Level 3</span>
            </div>
            <div className="kpi-value">{kpis.prototypeReady}</div>
            <div className="kpi-label">Prototypes Built</div>
            <div className="kpi-desc">Engineered in university labs</div>
          </div>

          {/* 5. Deployed Solutions */}
          <div className="kpi-card kpi-deployed">
            <div className="kpi-top">
              <div className="kpi-icon-wrap">
                <Award size={20} />
              </div>
              <span className="kpi-badge">Level 5</span>
            </div>
            <div className="kpi-value">{kpis.deployed}</div>
            <div className="kpi-label">Deployed Solutions</div>
            <div className="kpi-desc">Active & operational on ground</div>
          </div>

          {/* 6. Beneficiaries Impacted */}
          <div className="kpi-card kpi-beneficiaries">
            <div className="kpi-top">
              <div className="kpi-icon-wrap">
                <Users size={20} />
              </div>
              <span className="kpi-badge">Impact</span>
            </div>
            <div className="kpi-value">{kpis.beneficiaries.toLocaleString()}+</div>
            <div className="kpi-label">Citizens Benefited</div>
            <div className="kpi-desc">Direct population served by solutions</div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INNOVATION LIFECYCLE: 5-LEVEL PROGRESSION GUIDE
      ===================================================== */}
      <section id="innovation-stages" className="portal-stages-section">
        <div className="section-header-row">
          <div className="section-title-wrap">
            <h2>Civic Problem Innovation Lifecycle</h2>
            <p>
              Every problem statement reported by citizens progresses through 5 official stages—from initial ground verification to
              a fully deployed university innovation solution on the ground.
            </p>
          </div>
        </div>

        <div className="stages-pipeline-grid">
          {INNOVATION_LEVELS.map((stage) => {
            const isSelected = selectedLevel === stage.level;
            const countForStage = problems.filter((p) => (p.solution?.level || 1) === stage.level).length;

            return (
              <div
                key={stage.level}
                className={`stage-step-card ${isSelected ? "active" : ""}`}
                onClick={() => setSelectedLevel(isSelected ? "all" : stage.level)}
              >
                <div className={`stage-level-tag ${stage.badgeClass}`}>
                  Level {stage.level}: {stage.tag}
                </div>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>

                <div className="stage-bottom-metric">
                  <span>Active Challenges:</span>
                  <span className="count">{countForStage} Statements</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          STATE ANALYTICS BREAKDOWN (DOMAIN & DISTRICT)
      ===================================================== */}
      <section id="analytics-breakdown" className="portal-analytics-grid">
        {/* Domain / Category Breakdown */}
        <div className="analytics-panel">
          <div className="analytics-panel-header">
            <h3>
              <Layers size={18} />
              Challenges by Priority Domain
            </h3>
            <span style={{ fontSize: "12px", color: "#617b71", fontWeight: 600 }}>Active Solutions</span>
          </div>

          <div className="domain-bars-list">
            <DomainBar name="Water Management" count={problems.filter((p) => p.category === "Water Management").length || 3} total={problems.length || 6} colorClass="bar-fill-water" />
            <DomainBar name="Agriculture & Irrigation" count={problems.filter((p) => p.category === "Agriculture").length || 2} total={problems.length || 6} colorClass="bar-fill-agri" />
            <DomainBar name="Healthcare & Sanitation" count={problems.filter((p) => p.category === "Healthcare").length || 1} total={problems.length || 6} colorClass="bar-fill-health" />
            <DomainBar name="Renewable Energy" count={problems.filter((p) => p.category === "Energy").length || 1} total={problems.length || 6} colorClass="bar-fill-energy" />
            <DomainBar name="Urban Infrastructure" count={problems.filter((p) => p.category === "Urban Infrastructure").length || 1} total={problems.length || 6} colorClass="bar-fill-infra" />
            <DomainBar name="Environment & Forest" count={problems.filter((p) => p.category === "Environment").length || 1} total={problems.length || 6} colorClass="bar-fill-env" />
          </div>
        </div>

        {/* District Breakdown */}
        <div className="analytics-panel">
          <div className="analytics-panel-header">
            <h3>
              <MapPin size={18} />
              District Innovation Distribution
            </h3>
            <span style={{ fontSize: "12px", color: "#617b71", fontWeight: 600 }}>Verified Grievances</span>
          </div>

          <div className="district-bars-list">
            <DistrictBar name="Gumla District" count={problems.filter((p) => p.location?.district === "Gumla").length || 4} total={problems.length || 6} desc="Fluoride, Check-dam desilting, School tube-well" />
            <DistrictBar name="Ranchi District" count={problems.filter((p) => p.location?.district === "Ranchi").length || 2} total={problems.length || 6} desc="Urban drain bio-filter, Lac forest produce storage" />
            <DistrictBar name="Dhanbad District" count={1} total={problems.length || 6} desc="Mining effluent filtration & air quality" />
            <DistrictBar name="East Singhbhum (Jamshedpur)" count={1} total={problems.length || 6} desc="Industrial wastewater and micro-grid surges" />
            <DistrictBar name="Bokaro & Hazaribagh" count={1} total={problems.length || 6} desc="Cold storage and rural clinic telemedicine" />
          </div>
        </div>
      </section>

      {/* =====================================================
          MAP SECTION: INTERACTIVE JHARKHAND DISTRICT INNOVATION MAP
      ===================================================== */}
      <section id="district-map-section" className="portal-map-section" style={{ maxWidth: "1400px", margin: "0 auto 36px", padding: "0 24px" }}>
        <JharkhandDistrictMap
          selectedDistrict={selectedDistrict}
          onSelectDistrict={(dist) => {
            setSelectedDistrict(dist);
          }}
          onFilterChallenges={(dist) => {
            setSelectedDistrict(dist);
            const target = document.getElementById("problems-showcase");
            if (target) {
              const navOffset = 84;
              const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
              window.scrollTo({ top: elementPosition - navOffset, behavior: "smooth" });
            }
          }}
          problemsCountByDistrict={problemsCountByDistrict}
        />
      </section>

      {/* =====================================================
          VERIFIED PROBLEMS SHOWCASE & TRACKER (MAIN TABLE / CARDS)
      ===================================================== */}
      <section id="problems-showcase" className="portal-problems-showcase">
        <div className="section-header-row">
          <div className="section-title-wrap">
            <h2>Verified Problem Statements & Active Solutions</h2>
            <p>
              Showing only problem statements that have been physically verified by local authorities and selected for
              university problem-solving. Track their progress from verified status to deployed solution.
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="problems-filter-toolbar">
          <div className="toolbar-search-row">
            <div className="search-input-box">
              <Search size={16} color="#7a948a" />
              <input
                type="text"
                placeholder="Search by Problem ID (e.g. JH-000001), village, university, or solution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#7a948a" }}
                  onClick={() => setSearchQuery("")}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="filter-selects-wrap">
              {/* Category Dropdown */}
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categoriesList
                  .filter((c) => c !== "All")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>

              {/* District Dropdown */}
              <select
                className="filter-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="All">All Districts</option>
                {districtsList
                  .filter((d) => d !== "All")
                  .map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Level Filter Tabs & View Toggle Row */}
          <div className="toolbar-actions-row">
            <div className="level-filter-tabs" style={{ borderTop: "none", paddingTop: 0, flex: 1 }}>
              <button
                type="button"
                className={`level-tab-btn ${selectedLevel === "all" ? "active" : ""}`}
                onClick={() => setSelectedLevel("all")}
              >
                All Verified & Selected
                <span className="tab-pill-count">{problems.length}</span>
              </button>

              {INNOVATION_LEVELS.map((lvl) => {
                const count = problems.filter((p) => (p.solution?.level || 1) === lvl.level).length;
                return (
                  <button
                    key={lvl.level}
                    type="button"
                    className={`level-tab-btn ${selectedLevel === lvl.level ? "active" : ""}`}
                    onClick={() => setSelectedLevel(lvl.level)}
                  >
                    Level {lvl.level}: {lvl.tag}
                    <span className="tab-pill-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle: Cards vs Compact List */}
            <div className="toolbar-view-toggle">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === "cards" ? "active" : ""}`}
                onClick={() => setViewMode("cards")}
                title="Detailed Cards View"
              >
                <LayoutGrid size={15} />
                Cards
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === "compact" ? "active" : ""}`}
                onClick={() => setViewMode("compact")}
                title="Compact Table List View"
              >
                <List size={15} />
                Compact List
              </button>
            </div>
          </div>
        </div>

        {/* Problems Display (Cards or Compact Table) */}
        {filteredProblems.length > 0 ? (
          <>
            {viewMode === "cards" ? (
              <div className="problem-cards-list">
                {paginatedProblems.map((problem) => (
                  <VerifiedProblemCard
                    key={problem._id || problem.problemId}
                    problem={problem}
                    onViewTimeline={() => setActiveModalProblem(problem)}
                  />
                ))}
              </div>
            ) : (
              <CompactProblemsTable
                problems={paginatedProblems}
                onViewTimeline={(problem) => setActiveModalProblem(problem)}
              />
            )}

            {/* Pagination Controls Bar */}
            <div className="problems-pagination-bar">
              <div className="pagination-info">
                Showing <strong>{startIndex + 1}</strong> -{" "}
                <strong>{Math.min(startIndex + pageSize, filteredProblems.length)}</strong> of{" "}
                <strong>{filteredProblems.length}</strong> verified challenges
              </div>

              <div className="pagination-actions">
                <button
                  type="button"
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  title="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`page-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  title="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="page-size-wrap">
                <span>Display:</span>
                <select
                  className="page-size-select"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value={4}>4 per page</option>
                  <option value={6}>6 per page</option>
                  <option value={8}>8 per page</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="problems-empty-state">
            <AlertTriangle size={36} />
            <h4>No Verified Problems Match Your Filter</h4>
            <p>Try clearing your search query or switching to 'All Categories' or 'All Verified & Selected'.</p>
            <button
              type="button"
              className="btn-report"
              onClick={() => {
                setSearchQuery("");
                setSelectedLevel("all");
                setSelectedCategory("All");
                setSelectedDistrict("All");
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* =====================================================
          PUBLIC STATUS TIMELINE MODAL (NON-SENSITIVE DETAILS)
      ===================================================== */}
      {activeModalProblem && (
        <div className="timeline-modal-backdrop" onClick={() => setActiveModalProblem(null)}>
          <div className="timeline-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="problem-id-tag" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
                  #{activeModalProblem.problemId}
                </span>
                <h3 style={{ marginTop: "8px" }}>{activeModalProblem.title}</h3>
                <p>
                  {activeModalProblem.location?.village}, Block: {activeModalProblem.location?.block}, District: {activeModalProblem.location?.district}
                </p>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setActiveModalProblem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Level Badge Banner */}
              <div className="modal-level-hero">
                <div className="modal-level-hero-top">
                  <span className={`level-status-pill level-status-${activeModalProblem.solution?.level || 1}`}>
                    <span className="pulsing-dot"></span>
                    Current Stage: Level {activeModalProblem.solution?.level || 1} ({activeModalProblem.solution?.levelTag || "Verified"})
                  </span>
                  <span style={{ fontSize: "12px", color: "#4f6b60", fontWeight: 600 }}>
                    Category: {activeModalProblem.category}
                  </span>
                </div>
                {activeModalProblem.solution?.universityName && (
                  <div style={{ fontSize: "13px", color: "#10251d", marginTop: "6px" }}>
                    <strong>Adopted University:</strong> {activeModalProblem.solution.universityName}
                  </div>
                )}
                {activeModalProblem.solution?.impactOutcome && (
                  <div style={{ fontSize: "12.5px", color: "#065f46", marginTop: "4px", fontWeight: 500 }}>
                    <strong>Verified Impact:</strong> {activeModalProblem.solution.impactOutcome}
                  </div>
                )}
              </div>

              {/* Progress Stepper Inside Modal */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#10251d", marginBottom: "8px" }}>
                  Innovation Milestones Stepper
                </h4>
                <div className="stepper-bar-track" style={{ height: "8px" }}>
                  {[1, 2, 3, 4, 5].map((step) => {
                    const currentLevel = activeModalProblem.solution?.level || 1;
                    const isFilled = step <= currentLevel;
                    const isCurrent = step === currentLevel;
                    return (
                      <div
                        key={step}
                        className={`stepper-bar-segment ${isFilled ? "filled" : ""} ${isCurrent ? "current" : ""}`}
                      />
                    );
                  })}
                </div>
                <div className="stepper-dots-row">
                  <span>1. Verified</span>
                  <span>2. Adopted</span>
                  <span>3. Prototype</span>
                  <span>4. Field Test</span>
                  <span>5. Deployed</span>
                </div>
              </div>

              {/* Verified Timeline Stages */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#10251d", marginBottom: "12px" }}>
                  Verified Audit Timeline
                </h4>
                <div className="modal-timeline-list">
                  {activeModalProblem.timeline && activeModalProblem.timeline.length > 0 ? (
                    activeModalProblem.timeline.map((evt, idx) => (
                      <div key={idx} className="timeline-event-item completed">
                        <div className="timeline-event-dot"></div>
                        <div className="timeline-event-content">
                          <div className="timeline-event-title">
                            <span>Stage: {evt.stage.replace(/_/g, " ")}</span>
                            <span className="timeline-event-time">
                              {evt.timestamp ? new Date(evt.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                            </span>
                          </div>
                          <p className="timeline-event-desc">{evt.description}</p>
                          <div style={{ fontSize: "11px", color: "#7a948a", marginTop: "4px" }}>
                            Validated By: {evt.updaterName || "Local Authority"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "13px", color: "#666" }}>No detailed events recorded yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <span style={{ fontSize: "12px", color: "#617b71" }}>
                Grievance tracking verified by Government of Jharkhand
              </span>
              <button
                type="button"
                className="btn-view-timeline"
                onClick={() => setActiveModalProblem(null)}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          PUBLIC FOOTER
      ===================================================== */}
      <footer className="portal-footer">
        <div className="portal-footer-inner">
          <div className="footer-col">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div className="portal-logo-mark" style={{ width: "32px", height: "32px", fontSize: "13px" }}>
                IJ
              </div>
              <strong style={{ color: "#ffffff", fontSize: "16px" }}>Innovative Jharkhand</strong>
            </div>
            <p>
              An open civic transparency and technology incubation platform connecting citizens, Panchayati Raj Institutions
              (PRI), universities, and industry partners to solve ground problems across all 24 districts of Jharkhand.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/auth?role=citizen">Citizen Problem Submission</Link>
              </li>
              <li>
                <Link to="/auth?role=university">University Innovation Cell</Link>
              </li>
              <li>
                <Link to="/auth?role=government">PRI & Officer Portal</Link>
              </li>
              <li>
                <Link to="/auth?role=industry">Industry & CSR Sponsorship</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Citizen Helpdesk</h4>
            <p>Toll-Free Grievance Helpline: 1800-XXX-XXXX</p>
            <p>Department of Higher, Technical Education & Skill Development, Government of Jharkhand</p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>© 2026 Government of Jharkhand · Developed for Smart India Hackathon (SIH 2026)</div>
          <div>All civic problem data is publicly audited and protected against tampering.</div>
        </div>
      </footer>
    </div>
  );
}

/* =====================================================
   HELPER SUB-COMPONENTS
===================================================== */

function VerifiedProblemCard({ problem, onViewTimeline }) {
  const level = problem.solution?.level || 1;
  const levelTag = problem.solution?.levelTag || "Verified";

  const levelLabels = {
    1: "1. Verified",
    2: "2. Adopted",
    3: "3. Prototype",
    4: "4. Field Test",
    5: "5. Deployed",
  };

  return (
    <div className="verified-problem-card">
      {/* Top Meta: ID, Category, Level Status */}
      <div className="card-top-meta">
        <div className="card-id-category">
          <span className="problem-id-tag">#{problem.problemId || "JH-000000"}</span>
          <span className="problem-cat-pill">{problem.category}</span>
        </div>

        <span className={`level-status-pill level-status-${level}`}>
          <span className="pulsing-dot"></span>
          Level {level}: {levelTag}
        </span>
      </div>

      {/* Title & Description */}
      <h3>{problem.title}</h3>
      <p className="problem-summary">{problem.description}</p>

      {/* Geo Location & Impact Population */}
      <div className="problem-geo-strip">
        <span>
          <MapPin size={13} />
          {problem.location?.village ? `${problem.location.village}, ` : ""}
          {problem.location?.block ? `${problem.location.block}, ` : ""}
          {problem.location?.district}
        </span>

        {problem.impact?.estimatedPopulation > 0 && (
          <span>
            <Users size={13} />
            {problem.impact.estimatedPopulation.toLocaleString()} Citizens Impacted
          </span>
        )}
      </div>

      {/* TRL Solution Maturity Progress Tracker (Compact) */}
      <TrlProgressTracker
        currentLevel={level}
        compact={true}
        solutionInfo={problem.solution}
      />

      {/* University Solution Highlight (if assigned/developed) */}
      {problem.solution?.universityName && (
        <div className="university-solution-box">
          <div className="uni-box-top">
            <GraduationCap size={15} />
            <span>{problem.solution.universityName}</span>
            {problem.solution.teamName && (
              <span style={{ color: "#7a948a", fontWeight: 500 }}>· {problem.solution.teamName}</span>
            )}
          </div>
          {problem.solution.solutionTitle && (
            <div className="uni-box-title">{problem.solution.solutionTitle}</div>
          )}
          {problem.solution.impactOutcome && (
            <div className="uni-box-outcome">
              <strong>Impact:</strong> {problem.solution.impactOutcome}
            </div>
          )}
        </div>
      )}

      {/* Footer Action */}
      <div className="card-footer-action">
        <span className="card-date">
          <Calendar size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
          Reported {new Date(problem.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
        </span>

        <div className="card-footer-buttons">
          <Link
            to={`/citizen/problems/${problem.problemId || problem._id}`}
            className="btn-quad-hub-link"
            title="Open Quad-Helix Action Hub"
          >
            <Sparkles size={13} />
            <span>Quad-Helix Hub</span>
            <ArrowRight size={13} />
          </Link>

          <button type="button" className="btn-view-timeline" onClick={onViewTimeline}>
            Audit Timeline <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DomainBar({ name, count, total, colorClass }) {
  const percentage = Math.min(100, Math.round((count / (total || 1)) * 100));

  return (
    <div className="domain-bar-item">
      <div className="bar-info">
        <span className="name">{name}</span>
        <span className="count-tag">
          {count} {count === 1 ? "Problem" : "Problems"} ({percentage}%)
        </span>
      </div>
      <div className="bar-track">
        <div className={`bar-fill ${colorClass}`} style={{ width: `${Math.max(12, percentage)}%` }} />
      </div>
    </div>
  );
}

function DistrictBar({ name, count, total, desc }) {
  const percentage = Math.min(100, Math.round((count / (total || 1)) * 100));

  return (
    <div className="district-bar-item">
      <div className="bar-info">
        <span className="name">{name}</span>
        <span className="count-tag">{count} Verified</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill bar-fill-district" style={{ width: `${Math.max(14, percentage)}%` }} />
      </div>
      <span style={{ fontSize: "11px", color: "#7a948a", marginTop: "2px" }}>{desc}</span>
    </div>
  );
}

function CompactProblemsTable({ problems, onViewTimeline }) {
  const levelLabels = {
    1: "Level 1: Verified",
    2: "Level 2: Adopted",
    3: "Level 3: Prototype",
    4: "Level 4: Field Test",
    5: "Level 5: Deployed",
  };

  return (
    <div className="compact-table-container">
      <table className="problems-compact-table">
        <thead>
          <tr>
            <th>Problem ID</th>
            <th>Challenge & Category</th>
            <th>Location</th>
            <th>Solution Maturity (TRL)</th>
            <th>University / Lead Team</th>
            <th>Status Action</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => {
            const level = p.solution?.level || 1;
            return (
              <tr key={p._id || p.problemId}>
                <td>
                  <span className="problem-id-tag">#{p.problemId}</span>
                </td>
                <td style={{ maxWidth: "300px" }}>
                  <div className="table-problem-title">{p.title}</div>
                  <div className="table-problem-sub">{p.category}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: "#10251d", fontSize: "13px" }}>
                    {p.location?.district}
                  </div>
                  <div className="table-problem-sub">
                    {p.location?.village || p.location?.block || "Rural Hamlet"}
                  </div>
                </td>
                <td>
                  <TrlProgressTracker currentLevel={level} compact={true} solutionInfo={p.solution} />
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: "#10251d", fontSize: "12.5px" }}>
                    {p.solution?.universityName || "Panchayat Verification"}
                  </div>
                  {p.solution?.solutionTitle && (
                    <div
                      className="table-problem-sub"
                      style={{
                        maxWidth: "220px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={p.solution.solutionTitle}
                    >
                      {p.solution.solutionTitle}
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <button
                      type="button"
                      className="btn-table-action"
                      onClick={() => onViewTimeline(p)}
                    >
                      Audit
                    </button>
                    <Link
                      to={`/citizen/problems/${p.problemId || p._id}`}
                      className="btn-table-action"
                      style={{
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        borderColor: "#bfdbfe",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: 700,
                      }}
                      title="Open Quad-Helix Action Hub"
                    >
                      <span>Quad-Helix</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PublicBoard;
