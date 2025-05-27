"use client";

import React from "react";
import { Segmentos } from "./Segmentos";
import { useSegments } from "../hooks/useSegments";
import { segmentConstants } from "../constants/segments";
import { ChannelType } from "../constants/segments";

const ContactosPage = ({
  hasEmailPermission,
  hasSmsPermission,
  hasVoicePermission,
}: {
  hasEmailPermission: boolean;
  hasSmsPermission: boolean;
  hasVoicePermission: boolean;
}) => {
  const {
    segments,
    loading,
    page,
    hasNextPage,
    channelType,
    handleNextPage,
    handlePrevPage,
    handleChannelChange,
  } = useSegments({
    hasEmailPermission,
    hasSmsPermission,
    hasVoicePermission,
  });

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Buscar segmentos..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex space-x-2">
            {segmentConstants.channelTypes.map((channel) => (
              <button
                key={channel}
                disabled={
                  channel === "EMAIL"
                    ? !hasEmailPermission
                    : channel === "SMS"
                      ? !hasSmsPermission
                      : channel === "VOICE"
                        ? !hasVoicePermission
                        : false
                }
                onClick={() => handleChannelChange(channel as ChannelType)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 ${
                  channelType === channel
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 flex-grow overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : segments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {segments.map((segment) => (
              <Segmentos key={segment.segmentId} segment={segment} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 dark:text-gray-400">
              No hay segmentos disponibles para {channelType}
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      <div className="px-6 py-3 flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Página {page} · {channelType}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={page <= 1}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={segments.length === 0 || !hasNextPage}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactosPage;
