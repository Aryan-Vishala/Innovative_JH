import { Search, Filter, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { problemApi, getCurrentUser } from "../../services/api";
import ProblemCard from "../../components/problems/ProblemCard";
import "./MyProblems.css";

function MyProblems() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isCitizen = user?.primaryRole === "citizen";

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        // If citizen, fetch personal submissions; else fetch all directory problems
        const res = isCitizen
          ? await problemApi.getMySubmissions()
          : await problemApi.getAll();

        if (res.success && res.data) {
          setProblems(res.data);
        }
      } catch (err) {
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [isCitizen]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const title = problem.title || "";
      const cat = problem.category || "";
      const district = problem.location?.district || problem.district || "";

      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        cat.toLowerCase().includes(search.toLowerCase()) ||
        district.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" ||
        problem.status === status ||
        (status === "Submitted" && problem.status === "SUBMITTED") ||
        (status === "Under Review" && (problem.status === "SUBMITTED" || problem.status === "PRI_VERIFICATION_PENDING")) ||
        (status === "In Progress" && (problem.status === "PRI_VERIFIED" || problem.status === "NODAL_REVIEWED" || problem.status === "MASTER_PROBLEM_CREATED")) ||
        (status === "Resolved" && (problem.status === "DEPLOYED" || problem.status === "RESOLVED"));

      return matchesSearch && matchesStatus;
    });
  }, [problems, search, status]);

  return (
    <div className="my-problems-page">
      <div className="my-problems-header">
        <div>
          <h1>{isCitizen ? "My Reported Problems" : "Community Problems Directory"}</h1>
          <p>
            {isCitizen
              ? "View and track the status of problems you have reported."
              : "Browse and monitor community challenges across Jharkhand."}
          </p>
        </div>
      </div>

      <div className="problem-filters">
        <div className="problem-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title, category, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="status-filter">
          <Filter size={17} />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress (Verified / R&D)</option>
            <option value="Resolved">Resolved / Deployed</option>
          </select>
        </div>
      </div>

      <div className="problems-count">
        Showing {filteredProblems.length} problem{filteredProblems.length !== 1 ? "s" : ""}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px", color: "#6b7280" }}>
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <div className="all-problems-grid">
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem._id || problem.problemId}
              title={problem.title}
              description={problem.description}
              category={problem.category}
              district={problem.location?.district || problem.district}
              status={problem.status}
              priority={problem.impact?.citizenReportedSeverity || problem.priority || "Medium"}
              submittedBy={problem.submitterName || (isCitizen ? "You" : "Citizen")}
              date={
                problem.createdAt
                  ? new Date(problem.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recent"
              }
              onViewDetails={() =>
                navigate(`/citizen/problems/${problem.problemId || problem._id}`)
              }
            />
          ))}
        </div>
      )}

      {!loading && filteredProblems.length === 0 && (
        <div className="no-problems">
          <h3>No problems found</h3>
          <p>
            {isCitizen
              ? "You haven't reported any problems matching this filter."
              : "Try adjusting your search criteria or category filter."}
          </p>
        </div>
      )}
    </div>
  );
}

export default MyProblems;