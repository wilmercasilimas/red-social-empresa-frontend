import React, { useEffect, useState } from "react";
import logo from "../assets/logo.jpg";

interface Props {
  children: React.ReactNode;
}

const AppLayout: React.FC<Props> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header
        className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 ${
          scrolled ? "backdrop-blur-xl shadow-md" : "backdrop-blur-sm shadow"
        }`}
        style={{
          background: scrolled
            ? "linear-gradient(to bottom, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.02))"
            : "linear-gradient(to bottom, rgba(37, 99, 235, 0.95), rgba(37, 99, 235, 0.85))",
        }}
      >
        <div className="flex items-center w-full gap-3">
          {/* Logo más grande */}
          <img
            src={logo}
            alt="Logo Bom-Elec"
            className={`h-14 w-14 object-cover rounded-full bg-white shadow transition-opacity duration-300 ${
              scrolled ? "opacity-70" : "opacity-100"
            }`}
          />

          {/* Nombre de empresa sin negrita */}
          <h1
            className={`text-base sm:text-lg md:text-xl tracking-wide transition-colors duration-300 ${
              scrolled ? "text-black" : "text-white"
            }`}
          >
            Bom-Elec Multiservicios C.A
          </h1>

          {/* RIF más pequeño, sin negrita, alineado a la derecha */}
          <h3
            className={`ml-auto text-sm sm:text-base font-normal transition-colors duration-300 ${
              scrolled ? "text-black" : "text-white"
            }`}
          >
            Rif J-412430050
          </h3>
        </div>
      </header>

      <main className="pt-20 sm:pt-24 px-4 sm:px-6">{children}</main>
    </div>
  );
};

export default AppLayout;
