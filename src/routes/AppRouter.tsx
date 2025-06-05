import PublicacionesAdmin from "../pages/admin/PublicacionesAdmin";

// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/AdminPanel";
import EmpleadoPanel from "../pages/EmpleadoPanel";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../layouts/AppLayout";
import IncidenciasAdmin from "../pages/admin/IncidenciasAdmin";
import GerenciaPanel from "../pages/gerencia/GerenciaPanel"; // ✅ nueva importación



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

        {/* Ruta privada - panel de gerencia */}
        <Route
          path="/gerencia"
          element={
            <PrivateRoute>
              <AppLayout>
                <GerenciaPanel />
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

        {/* Ruta directa a incidencias admin */}
        <Route
          path="/admin/incidencias"
          element={
            <PrivateRoute>
              <AppLayout>
                <IncidenciasAdmin />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route path="/admin/publicaciones" element={<PublicacionesAdmin />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
