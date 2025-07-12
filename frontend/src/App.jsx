import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Editor from "./pages/Editor";
import ProblemList from "./pages/ProblemList";
import Submissions from "./pages/Submissions";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AddProblem from "./pages/AddProblem"; // ✅ Step 1: Import AddProblem

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white transition-all">
        <BrowserRouter>
          <Navbar />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/add-problem" // ✅ Step 2: Add Route
              element={
                <AdminRoute>
                  <AddProblem />
                </AdminRoute>
              }
            />
            <Route
              path="/problems"
              element={
                <ProtectedRoute>
                  <ProblemList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:id"
              element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submissions"
              element={
                <ProtectedRoute>
                  <Submissions />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
