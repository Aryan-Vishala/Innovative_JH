import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Auth from "./pages/auth/Auth";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route
          path="/"
          element={<Navigate to="/auth?mode=login" replace />}
        />

        {/* Authentication */}
        <Route
          path="/auth"
          element={<Auth />}
        />

        {/* Government dashboard for now */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to="/auth?mode=login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;