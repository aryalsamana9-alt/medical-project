import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MedicalProvider } from "./context/MedicalContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import DashboardLayout from "./components/DashboardLayout";
import BookingModal from "./components/BookingModal";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import RegisterName from "./pages/RegisterName";
import RegisterDOB from "./pages/RegisterDOB";
import RegisterPassword from "./pages/RegisterPassword";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import FormPage from "./pages/FormPage";
import DoctorsPage from "./pages/DoctorsPage";
import MessagesPage from "./pages/MessagesPage";
import QuizPage from "./pages/QuizPage";
import AppointmentsPage from "./pages/AppointmentsPage";

export default function App() {
  return (
    <AuthProvider>
      <MedicalProvider>
        <BrowserRouter>
          <BookingModal />
          <Routes>
            {/* Public routes — use original Navbar */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <main className="main-content">
                    <Landing />
                  </main>
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <main className="main-content">
                    <Login />
                  </main>
                </>
              }
            />
            <Route
              path="/register/name"
              element={
                <>
                  <Navbar />
                  <main className="main-content">
                    <RegisterName />
                  </main>
                </>
              }
            />
            <Route
              path="/register/dob"
              element={
                <>
                  <Navbar />
                  <main className="main-content">
                    <RegisterDOB />
                  </main>
                </>
              }
            />
            <Route
              path="/register/password"
              element={
                <>
                  <Navbar />
                  <main className="main-content">
                    <RegisterPassword />
                  </main>
                </>
              }
            />

            {/* Protected routes — use DashboardLayout with sidebar + bottom nav */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Home />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/form"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <FormPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DoctorsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MessagesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <QuizPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          <Route
            path="/medical-history"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="placeholder-page">
                    <div className="placeholder-icon">📋</div>
                    <h2>Medical History</h2>
                    <p>Complete health records and visit history.</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AppointmentsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quick-contact"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="placeholder-page">
                    <div className="placeholder-icon">📞</div>
                    <h2>Quick Contact</h2>
                    <p>Get instant support from our healthcare team.</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="placeholder-page">
                    <div className="placeholder-icon">⚙️</div>
                    <h2>Settings</h2>
                    <p>Manage your account preferences and security.</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      </MedicalProvider>
    </AuthProvider>
  );
}
