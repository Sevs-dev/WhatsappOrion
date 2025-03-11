"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfigAdmin from "./../../components/ConfigAdmin/ConfigAdmin";

const ConfiguracionPage = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    // Si no es admin, redirigir a /dashboard/home
    if (!adminStatus) {
      router.push("/dashboard/home");
    }
  }, [router]);

  return (
    <div>
      <ConfigAdmin />
    </div>
  );
};

export default ConfiguracionPage;
