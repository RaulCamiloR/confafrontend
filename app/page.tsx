"use server";
// hi
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./data/auth";
import HomeFeature from "./components/HomeFeature";
import {
  MdOutlineCampaign,
  MdOutlineCalendarMonth,
  MdOutlineAssessment,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";
import LogoutBtn from "./components/LogoutBtn";
import { testPolicy } from "./data/policies";
import {
  Actions,
  campaignsPages,
  reportesPages,
  agendaDinamicaPages,
  adminPages,
} from "./data/utils";

const HomePage = async () => {
  const cookieStore = await cookies();
  const user = await getCurrentUser();
  if (!cookieStore.has("IdToken") || !user) {
    redirect("/auth");
  }

  const hasCampaignsAccess = await testPolicy(Actions.Read, campaignsPages);
  const hasAgendaDinamicaAccess = await testPolicy(
    Actions.Read,
    agendaDinamicaPages,
  );
  const hasReportsAccess = await testPolicy(Actions.Read, reportesPages);
  const hasAdminAccess = await testPolicy(Actions.Read, adminPages);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-800">
      {/* Header con bienvenida y botón de logout */}
      <div className="bg-white dark:bg-gray-700 p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-800 dark:text-white">
          Hola,{" "}
          <span className="font-bold text-orange-500">
            {user.name || "..."}
          </span>
        </h1>
        <LogoutBtn />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex gap-6 flex-wrap justify-center">
          {hasCampaignsAccess && (
            <HomeFeature
              title="Campañas"
              description="Gestiona tus campañas de marketing"
              icon={MdOutlineCampaign}
              iconColor="text-orange-500"
              href="/dashboard"
            />
          )}
          {hasAgendaDinamicaAccess && (
            <HomeFeature
              title="Agenda Dinamica"
              description="Actualiza tu agenda de disponibilidad"
              icon={MdOutlineCalendarMonth}
              iconColor="text-green-600"
              href="/agenda"
            />
          )}
          {hasReportsAccess && (
            <HomeFeature
              title="Reportes"
              description="Aqui puedes ver los reportes"
              icon={MdOutlineAssessment}
              iconColor="text-blue-500"
              href="/reportes"
            />
          )}

          {/* Validacion de rol de Admin */}
          {hasAdminAccess && (
            <HomeFeature
              title="Admin"
              description="Solo los administradores"
              icon={MdOutlineAdminPanelSettings}
              iconColor="text-purple-800"
              href="/admin"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
