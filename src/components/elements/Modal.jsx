import React from "react";

// Definimos los tamaños del modal
const sizeClasses = {
  sm: "w-full max-w-sm", // Pequeño
  md: "w-full max-w-md", // Mediano (por defecto)
  lg: "w-full max-w-lg", // Grande
  xl: "w-full max-w-xl", // Extra grande
  full: "w-full h-full", // Ocupa toda la pantalla
};

const Modal = ({
  isOpen,
  onClose,
  size = "md", // Tamaño por defecto: md
  titulo = null,
  children,
}) => {
  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Fondo oscuro semi-transparente */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose} // Cierra el modal al hacer clic fuera
      ></div>

      {/* Contenedor del modal */}
      <div
        className={`bg-white shadow-lg z-50 overflow-hidden ${sizeClasses[size]} rounded-b-lg`} // Bordes redondeados solo en la parte inferior
      >
        {/* Encabezado del modal */}
        {titulo && (
          <div className="bg-[#70C544] px-6 py-4 text-white flex justify-between items-center">
            <h2 className="text-xl font-bold">{titulo}</h2>
            {/* Botón de cerrar (X) */}
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <span className="text-2xl">&times;</span> {/* Icono de cierre (X) */}
            </button>
          </div>
        )}

        {/* Contenido del modal */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;