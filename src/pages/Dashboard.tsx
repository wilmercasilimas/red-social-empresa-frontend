import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h1>
        <p><strong>Nombre:</strong> {user.nombre} {user.apellidos}</p>
        <p><strong>Correo:</strong> {user.email}</p>
        <p><strong>Cargo:</strong> {user.cargo}</p>
        <p><strong>Área:</strong> {user.area}</p> 
        <p><strong>Rol:</strong> {user.rol}</p>
      </div>
    </div>
  );
};

export default Dashboard;

