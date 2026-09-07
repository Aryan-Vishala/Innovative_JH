import {
  LayoutDashboard,
  AlertTriangle,
  GraduationCap,
  Building2,
  FolderKanban,
  BarChart3,
  Bell,
  Settings,
  Map,
  LogOut,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">IJ</div>

        <div>
          <h2>Innovative</h2>
          <span>Jharkhand</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="nav-label">MAIN MENU</p>

        <a href="#" className="nav-item active">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </a>

        <a href="#" className="nav-item">
          <AlertTriangle size={19} />
          <span>Problems</span>
        </a>

        <a href="#" className="nav-item">
          <GraduationCap size={19} />
          <span>Universities</span>
        </a>

        <a href="#" className="nav-item">
          <Building2 size={19} />
          <span>Industry</span>
        </a>

        <a href="#" className="nav-item">
          <FolderKanban size={19} />
          <span>Projects</span>
        </a>

        <a href="#" className="nav-item">
          <BarChart3 size={19} />
          <span>Analytics</span>
        </a>

        <a href="#" className="nav-item">
          <Map size={19} />
          <span>Districts</span>
        </a>

        <p className="nav-label">SYSTEM</p>

        <a href="#" className="nav-item">
          <Bell size={19} />
          <span>Notifications</span>
          <span className="notification-count">3</span>
        </a>

        <a href="#" className="nav-item">
          <Settings size={19} />
          <span>Settings</span>
        </a>

      </nav>

      {/* User */}
      <div className="sidebar-bottom">

        <div className="user-card">
          <div className="avatar">
            A
          </div>

          <div className="user-info">
            <strong>Administrator</strong>
            <span>Government Portal</span>
          </div>
        </div>

        <button className="logout-btn">
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;