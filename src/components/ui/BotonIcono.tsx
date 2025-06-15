import type { LucideIcon } from "lucide-react";

interface BotonIconoProps {
  onClick?: () => void;
  type?: "button" | "submit";
  texto: string;
  Icono: LucideIcon;
  cargando?: boolean;
  variante?: "primario" | "secundario" | "peligro";
  className?: string;
}

const BotonIcono: React.FC<BotonIconoProps> = ({
  onClick,
  type = "button",
  texto,
  Icono,
  cargando = false,
  variante = "primario",
  className = "",
}) => {
  const estilosBase =
    "px-4 py-2 rounded flex items-center gap-2 transition disabled:opacity-50";

  let estilosVariante = "";

  switch (variante) {
    case "secundario":
      estilosVariante = "bg-gray-300 text-gray-800 hover:bg-gray-400";
      break;
    case "peligro":
      estilosVariante = "bg-red-600 text-white hover:bg-red-700";
      break;
    default:
      estilosVariante = "bg-blue-600 text-white hover:bg-blue-700";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={cargando}
      className={`${estilosBase} ${estilosVariante} ${className}`}
    >
      {cargando ? (
        `${texto}...`
      ) : (
        <>
          <Icono className="w-4 h-4" />
          <span className="hidden sm:inline">{texto}</span>
        </>
      )}
    </button>
  );
};

export default BotonIcono;
