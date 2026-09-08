import { Search, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockProblems } from "../../data/mockProblems";
import ProblemCard from "../../components/problems/ProblemCard";
import "./MyProblems.css";

function MyProblems() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredProblems = useMemo(() => {
    return mockProblems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.category.toLowerCase().includes(search.toLowerCase()) ||
        problem.district.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || problem.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="my-problems-page">

      <div className="my-problems-header">
        <div>
          <h1>My Problems</h1>
          <p>
            View and track all problems you have reported.
          </p>
        </div>
      </div>

      <div className="problem-filters">

        <div className="problem-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search problems..."
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
            <option value="All">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

      </div>

      <div className="problems-count">
        Showing {filteredProblems.length} problem
        {filteredProblems.length !== 1 ? "s" : ""}
      </div>

      <div className="all-problems-grid">

        {filteredProblems.map((problem) => (
          <ProblemCard
            key={problem.id}
            {...problem}
            onViewDetails={() =>
              navigate(`/citizen/problems/${problem.id}`)
            }
          />
        ))}

      </div>

      {filteredProblems.length === 0 && (
        <div className="no-problems">
          <h3>No problems found</h3>
          <p>Try changing your search or filter.</p>
        </div>
      )}

    </div>
  );
}

export default MyProblems;