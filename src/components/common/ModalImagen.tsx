import React from "react";

type ModalImagenProps = {
  imagenUrl: string;
  onClose: () => void;
};

const ModalImagen: React.FC<ModalImagenProps> = ({ imagenUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="relative max-w-3xl w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-black rounded-full px-2 py-1 text-sm hover:bg-gray-200"
        >
          ✖
        </button>
        <img
          src={imagenUrl}
          alt="Imagen ampliada"
          className="w-full h-auto max-h-[90vh] rounded shadow-lg object-contain"
        />
      </div>
    </div>
  );
};

export default ModalImagen;
