import Sidebar from '../components/Sidebar';
import WalkthroughBar from '../components/WalkthroughBar';

export default function DashboardLayout({ children, activeUser, onUserSwitched }) {
  return (
    <div className="dashboard-layout">
      <Sidebar activeUser={activeUser} />

      <div className="main-wrapper">
        <WalkthroughBar activeUser={activeUser} onUserSwitched={onUserSwitched} />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}