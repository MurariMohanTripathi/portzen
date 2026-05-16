import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AppShell from "./layouts/AppShell";
import AdminLayout from "./layouts/AdminLayout";
import LoadingScreen from "./components/ui/LoadingScreen";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const TemplatePreview = lazy(() => import("./pages/TemplatePreview"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ className: "toast" }} />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/preview/:template" element={<TemplatePreview />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<AppShell />}>
                <Route index element={<Navigate to="/dashboard/overview" replace />} />
                <Route path="overview" element={<Dashboard view="overview" />} />
                <Route path="edit" element={<Dashboard view="edit" />} />
                <Route path="projects" element={<Dashboard view="projects" />} />
                <Route path="experience" element={<Dashboard view="experience" />} />
                <Route path="templates" element={<Dashboard view="templates" />} />
                <Route path="settings" element={<Dashboard view="settings" />} />
                <Route path="stories" element={<Dashboard view="stories" />} />
              </Route>
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/users" replace />} />
                <Route path="users" element={<AdminDashboard view="users" />} />
                <Route path="analytics" element={<AdminDashboard view="analytics" />} />
                <Route path="templates" element={<AdminDashboard view="templates" />} />
                <Route path="settings" element={<AdminDashboard view="settings" />} />
              </Route>
            </Route>

            <Route path="/:username" element={<PortfolioPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
