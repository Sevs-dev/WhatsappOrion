"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/loader/Loader";

const withAuth = (WrappedComponent) => {
  return function AuthComponent(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      } else {
        setTimeout(() => setLoading(false), 1000);
      }
    }, [router]);

    if (loading) {
      return <Loader />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
