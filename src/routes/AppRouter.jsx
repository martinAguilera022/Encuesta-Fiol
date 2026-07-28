import { Routes, Route } from "react-router-dom";

import Survey from "../pages/Survey";
import Thanks from "../pages/Thanks";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import Responses from "../pages/Responses";
import Comments from "../pages/Comments";
import NotFound from "../pages/NotFound";
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Survey />} />

      <Route path="/gracias" element={<Thanks />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
          <Route
        path="/dashboard/respuestas"
        element={
          <ProtectedRoute>
            <Responses />
          </ProtectedRoute>
        }
      />
       <Route
        path="/dashboard/comentarios"
        element={
          <ProtectedRoute>
            <Comments />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;