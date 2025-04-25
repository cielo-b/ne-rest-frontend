import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import AuthRegisterProtected from "./routes/AuthRegisterProtected";
import NotFound from "./pages/Notfound";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AuthRegisterProtected><Login /></AuthRegisterProtected>} />
        <Route path="/register" element={<AuthRegisterProtected><Register /></AuthRegisterProtected>}  />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
