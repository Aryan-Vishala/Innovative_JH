import { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { api } from './services/api.js';

import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CitizenView from './pages/CitizenView';
import PriConsole from './pages/PriConsole';
import NodalConsole from './pages/NodalConsole';
import HeiWorkspace from './pages/HeiWorkspace';
import EvaluationPanel from './pages/EvaluationPanel';
import PilotTelemetry from './pages/PilotTelemetry';
import AuditTrail from './pages/AuditTrail';
import Auth from './pages/auth/Auth';

function App() {
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    // Initialize default active user
    api.getUsers().then((res) => {
      if (res.success && res.users.length > 0) {
        const storedUserId = localStorage.getItem('activeUserId');
        const found = res.users.find((u) => u.id === storedUserId) || res.users[0];
        setActiveUser(found);
        localStorage.setItem('activeUserId', found.id);
      }
    }).catch(console.error);
  }, []);

  const handleUserSwitched = (newUser) => {
    setActiveUser(newUser);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth page */}
        <Route path="/auth" element={<Auth />} />

        {/* Vertical Slice Workflow Routes */}
        <Route
          path="/citizen"
          element={
            <DashboardLayout activeUser={activeUser} onUserSwitched={handleUserSwitched}>
              <CitizenView />
            </DashboardLayout>
          }
        />

        <Route
          path="/pri-verify"
          element={
            <DashboardLayout activeUser={activeUser} onUserSwitched={handleUserSwitched}>
              <PriConsole />
            </DashboardLayout>
          }
        />

        <Route
          path="/nodal-orchestration"
          element={
            <DashboardLayout activeUser={activeUser} onUserSwitched={handleUserSwitched}>
              <NodalConsole />
            </DashboardLayout>
          }
        />

        <Route
          path="/proposals-workspace"
          element={
            <DashboardLayout activeUser={activeUser} onUserSwitched={handleUserSwitched}>
              <HeiWorkspace />
            </DashboardLayout>
          }
        />

        <Route
          path="/evaluation-panel"
          element={
            <DashboardLayout activeUser={activeUser} onUserSwitched={handleUserSwitched}>
              <EvaluationPanel />
            </DashboardLayout>
          }
        />

        <Route
          path="/pilot-telemetry"
          element={
            <DashboardLayout activeUser={activeUser} onUserSwitched={handleUserSwitched}>
              <PilotTelemetry />
            </DashboardLayout>
          }
        />

        <Route
          path="/audit-trail"
          element={
            <DashboardLayout activeUser={activeUser} onUserSwitched={handleUserSwitched}>
              <AuditTrail />
            </DashboardLayout>
          }
        />

        {/* State Macro Dashboard */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout activeUser={activeUser} onUserSwitched={handleUserSwitched}>
              <Dashboard />
            </DashboardLayout>
          }
        />

        {/* Default route to benchmark step 1 */}
        <Route path="/" element={<Navigate to="/citizen" replace />} />
        <Route path="*" element={<Navigate to="/citizen" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;