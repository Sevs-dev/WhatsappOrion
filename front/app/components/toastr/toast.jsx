import React from "react";

const Toast = ({ type, message }) => {
  // Mapear estilos e iconos según el tipo de notificación
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
  };

  const icons = {
    success: "✔",
    failure: "✖",
    warning: "⚠️",
  };

  // Clases para el contenedor y el icono con animación
  const containerClasses = `
    min-w-[22rem] p-4 rounded-md shadow relative
    ${typeMapping[type]?.container || ""}
    animate-toast-in-out
  `;

  const iconClasses = `
    w-5 h-5 flex items-center justify-center rounded-full text-sm
    ${typeMapping[type]?.icon || ""}
  `;

  return (
    <div className="fixed top-5 right-5 flex flex-col gap-2 z-[9999]">
      <div className={containerClasses}>
        <div className="flex items-center gap-2">
          <div className={iconClasses}>
            {icons[type]}
          </div>
          <span>{message}</span>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-[3px] bg-current opacity-50 animate-progress" />
      </div>
    </div>
  );
};

export default Toast;
