import React from "react";

const Toast = ({ type, message, onConfirm, onCancel }) => {
  // Mapeo de estilos e íconos según el tipo de notificación
  const typeMapping = {
    success: {
      container: "bg-[#4bb543] text-white",
      icon: "bg-white text-[#4bb543]",
    },
    failure: {
      container: "bg-[#371818] text-[#ff4d4d]",
      icon: "bg-[#ff4d4d] text-white",
    },
    warning: {
      container: "bg-[#fbbd09] text-black",
      icon: "bg-black text-[#fbbd09]",
    },
    // Estilo para confirmación (si se usan onConfirm y onCancel)
    confirm: {
      container: "bg-yellow-500 text-black",
      icon: "bg-black text-yellow-500",
    },
  };

  const icons = {
    success: "✔",
    failure: "✖",
    warning: "⚠️",
    confirm: "⚠️",
  };

  // Determinar si es un toast de confirmación en base a la presencia de onConfirm y onCancel
  const isConfirmation =
    typeof onConfirm === "function" && typeof onCancel === "function";

  // Si es confirmación, usamos el estilo "confirm", sino usamos el tipo pasado
  const currentType = isConfirmation ? "confirm" : type;

  // Clases para el contenedor: si es confirmación no se aplican animaciones
  const containerClasses = `
    min-w-[22rem] p-4 rounded-md shadow relative
    ${typeMapping[currentType]?.container || ""}
    ${!isConfirmation ? "animate-toast-in-out" : ""}
  `;

  const iconClasses = `
    w-5 h-5 flex items-center justify-center rounded-full text-sm
    ${typeMapping[currentType]?.icon || ""}
  `;

  return (
    <div className="fixed top-5 right-5 flex flex-col gap-2 z-[9999]">
      <div className={containerClasses}>
        <div className="flex items-center gap-2">
          <div className={iconClasses}>{icons[currentType]}</div>
          <span>{message}</span>
        </div>
        {isConfirmation && (
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Aceptar
            </button>
          </div>
        )}
        {/* Mostramos la barra de progreso solo si NO es de confirmación */}
        {!isConfirmation && (
          <div className="absolute left-0 bottom-0 w-full h-[3px] bg-current opacity-50 animate-progress" />
        )}
      </div>
    </div>
  );
};

export default Toast;
