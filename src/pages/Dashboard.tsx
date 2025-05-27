import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/common/Topbar";
import avatarDefault from "../assets/user.png";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-8 fade-in">
        <div className="card-panel animate-slide-up flex items-center gap-6">
          {/* Avatar */}
          <img
            src={user.imagen ? user.imagen : avatarDefault}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow"
          />

          {/* Información */}
          <div>
            <h1 className="title-main mb-4 animate-slide-up">Bienvenido al Dashboard</h1>
            <p><strong>Nombre:</strong> {user.nombre} {user.apellidos}</p>
            <p><strong>Correo:</strong> {user.email}</p>
            <p><strong>Cargo:</strong> {user.cargo}</p>
            <p><strong>Área:</strong> {user.area}</p> 
            <p><strong>Rol:</strong> <span className="badge bg-blue-100 text-blue-700">{user.rol}</span></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
