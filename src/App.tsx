
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import SuspenseLoader from "./components/SuspenseLoader";
import Dashboard from "./pages/Dashboard";
import { ErrorBoundary } from "./components/ui/error/ErrorBoundary";
import { ModeProvider } from "./context/ModeContext";
import "./i18n";

// التحميل الكسول للصفحات
const NetworkScanner = lazy(() => import("./pages/NetworkScanner"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Simulation = lazy(() => import("./pages/Simulation"));
const License = lazy(() => import("./pages/License"));
const Settings = lazy(() => import("./pages/Settings"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Tools = lazy(() => import("./pages/Tools"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const RealNetworkMonitor = lazy(() => import("./pages/RealNetworkMonitor"));

const App = () => {
  return (
    <ModeProvider>
      <ErrorBoundary>
        <Router basename={import.meta.env.BASE_URL}>
          <Layout>
            <Suspense fallback={<SuspenseLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/fiber-optic" element={<NetworkScanner />} />
                <Route path="/real-monitor" element={<RealNetworkMonitor />} />
                <Route path="/ai" element={<AIAssistant />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/license" element={<License />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help-center" element={<HelpCenter />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ErrorBoundary>
    </ModeProvider>
  );
};

export default App;
