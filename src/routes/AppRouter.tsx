// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/AdminPanel";
import EmpleadoPanel from "../pages/EmpleadoPanel";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../layouts/AppLayout";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Ruta privada - dashboard general */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Ruta privada - panel de administrador */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AppLayout>
                <AdminPanel />
              </AppLayout>
            </PrivateRoute>
          }
        />

        {/* Ruta privada - panel de empleado */}
        <Route
          path="/empleado"
          element={
            <PrivateRoute>
              <AppLayout>
                <EmpleadoPanel />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
