import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Auth from "./pages/auth/Auth";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";

import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import MyProblems from "./pages/citizen/MyProblems";
import ProblemDetails from "./pages/citizen/ProblemDetails";
import SubmitProblem from "./pages/citizen/SubmitProblem";

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
        {/*  Citizen problem */}

        <Route
          path="/citizen"
          element={
            <DashboardLayout>
              <CitizenDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/citizen/submit-problem"
          element={
            <DashboardLayout>
              <SubmitProblem />
            </DashboardLayout>
          }
        />

        <Route
          path="/citizen/my-problems"
          element={
            <DashboardLayout>
              <MyProblems />
            </DashboardLayout>
          }
        />

        <Route
          path="/citizen/problems/:id"
          element={
            <DashboardLayout>
              <ProblemDetails />
            </DashboardLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;