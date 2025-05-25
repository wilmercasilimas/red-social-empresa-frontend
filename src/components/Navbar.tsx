import React from "react";
import logo from "../assets/logo.jpg"; // asegúrate de tener esta imagen en assets/

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        <img
          src={logo}
          alt="Logo de empresa"
          className="w-10 h-10 object-cover rounded-full shadow"
        />
        <div className="text-lg font-semibold tracking-wide">
          Red Social Empresarial
        </div>
      </div>
    </header>
  );
};

export default Navbar;
