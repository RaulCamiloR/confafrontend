"use client";

import HomeFeature from "@/components/HomeFeature";
import {
  MdOutlineCampaign,
  MdLogout,
  MdOutlineCalendarMonth,
  MdOutlineAssessment,
} from "react-icons/md";
import { IconType } from "react-icons";
import useUserStore from "@/stores/userStore";
import useLogout from "@/hooks/useLogout";
import { redirect } from "next/navigation";

interface HomeFeature {
  title: string;
  description: string;
  icon: IconType;
  iconColor: string;
  href: string;
}

const homeFeatures: HomeFeature[] = [
  {
    title: "Campañas",
    description: "Gestiona tus campañas de marketing",
    icon: MdOutlineCampaign,
    iconColor: "text-orange-500",
    href: "/dashboard",
  },
  {
    title: "Agenda Dinamica",
    description: "Actualiza tu agenda de disponibilidad",
    icon: MdOutlineCalendarMonth,
    iconColor: "text-green-600",
    href: "/agenda",
  },
  {
    title: "Reportes",
    description: "Aqui puedes ver los reportes",
    icon: MdOutlineAssessment,
    iconColor: "text-blue-500",
    href: "/reportes",
  },
];

export default function HomePage() {
  const user = useUserStore((state) => state.user);
  const { logout, isLoading } = useLogout();

  if (user == null && !isLoading) {
    redirect("/auth");
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-800">
      {/* Header con bienvenida y botón de logout */}
      <div className="bg-white dark:bg-gray-700 p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-800 dark:text-white">
          {`${user?.name ? "Hola, " : "Cerrando sesión..."}`}{" "}
          <span className="font-bold text-orange-500">
            {user?.name || "..."}
          </span>
        </h1>
        <button
          onClick={logout}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
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
                Cerrando sesión...
              </span>
            </>
          ) : (
            <>
              <MdLogout className="text-orange-500" />
              <span className="text-gray-700 dark:text-white">
                Cerrar Sesión
              </span>
            </>
          )}
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex gap-6 flex-wrap justify-center">
          {homeFeatures.map((feature, index) => (
            <HomeFeature key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}

