"use client";

import { useRouter } from "next/navigation";

export const Segmentos = ({ segment }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/contactos/${segment.segmentId}`);
  };

  return (
    <div
      key={segment.segmentId}
      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800 dark:text-white truncate max-w-[70%]">
          {segment.segmentName}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            segment.status === "COMPLETED"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
          }`}
        >
          {segment.status}
        </span>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>Tipo: {segment.channel}</p>
        {/*<p>Registros procesados: {segment.recordsProcessed}</p>*/}
        <p>Creado: {new Date(segment.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
