"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

const CampaniaDetallePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const searchParams = useSearchParams();
  const channel = searchParams.get("channel");

  if (!channel) {
    router.back();
    return "No Channel sent";
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-auto p-6 gap-6">
      <div className="flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <MdArrowBack className="text-orange-500 text-xl" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Detalle de Campaña
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-600">
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
            Información General
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ID: <span className="font-mono font-medium">{id}</span>
          </p>
        </div>

        <div className="py-4">
          <p className="text-gray-500 dark:text-gray-400 italic">
            Contenido adicional del detalle de la campaña se mostrará aquí.
          </p>
        </div>
      </div>
      {channel === "VOICE" && (
        <div className="flex gap-4">
          <a
            className="px-4 py-2 rounded-md bg-orange-500 text-white cursor-pointer"
            type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            href={`/api/campaigns/report?channelType=${channel}&campaignId=${id}&format=xlsx`}
            target="_blank"
          >
            Descargar xlsx
          </a>
          <a
            className="px-4 py-2 rounded-md bg-orange-500 text-white cursor-pointer"
            type="text/csv"
            href={`/api/campaigns/report?channelType=${channel}&campaignId=${id}&format=csv`}
            target="_blank"
          >
            Descargar csv
          </a>
        </div>
      )}
    </div>
  );
};

export default CampaniaDetallePage;
