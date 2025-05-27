"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { MdLogout } from "react-icons/md";

const LogoutBtn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      router.push("/auth");

      // No cambiamos isLoading a false porque estamos redirigiendo
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <button
        disabled
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="animate-spin h-4 w-4 mr-2 text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-gray-700 dark:text-white">
          Cerrando sesión ...
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={logout}
      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      <MdLogout className="text-orange-500" />
      <span className="text-gray-700 dark:text-white">Cerrar Sesión</span>
    </button>
  );
};

export default LogoutBtn;
