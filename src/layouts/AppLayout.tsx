import React from "react";

interface Props {
  children: React.ReactNode;
}

const AppLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header común */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <h1 className="text-xl font-bold">Red Social Empresarial</h1>
      </header>

      {/* Contenido principal */}
      <main className="p-6">{children}</main>
    </div>
  );
};

export default AppLayout;
