"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfigAdmin from "./../../components/ConfigAdmin/ConfigAdmin";

const ConfiguracionPage = () => {
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    console.log("User Email:", userEmail); // Depuración
    
    // Si no es el admin, redirigir a Home
    if (userEmail !== "admin@logismart.com.co") {
      router.push("/dashboard/home");
    }
  }, []);

  return (
    <div >
      <ConfigAdmin />
    </div>
  );
};

export default ConfiguracionPage;
