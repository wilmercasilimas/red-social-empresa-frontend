// src/layouts/AppLayout.tsx (o donde esté ubicado)
import React, { useEffect, useState } from "react";

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
      {/* ✅ Header fijo con fondo degradado y responsive */}
      <header
        className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 shadow-md ${
          scrolled ? "backdrop-blur-md" : ""
        }`}
        style={{
          background: scrolled
            ? "linear-gradient(to bottom, rgba(37, 99, 235, 0.9), rgba(37, 99, 235, 0.5))"
            : "linear-gradient(to bottom, rgba(37, 99, 235, 1), rgba(37, 99, 235, 0.3))",
        }}
      >
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide">
          Red Social Empresarial
        </h1>
      </header>

      {/* ✅ Contenido principal con margen superior para evitar solapamiento */}
      <main className="pt-20 sm:pt-24 px-4 sm:px-6">{children}</main>
    </div>
  );
};

export default AppLayout;
