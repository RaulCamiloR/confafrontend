"use client";

import React, { useState, useEffect } from "react";
import { CampaniaCard } from "./CampaniaCard";
import axios from "axios";

interface Campaign {
  id: string;
  name?: string;
  type: string;
  status: string;
  senders: any; // O define una interfaz específica si conoces la estructura
}
const itemsPerPage = 9; // Mismo número que en la página de contactos

const CampaniasPage = ({
  hasEmailPermission,
  hasSmsPermission,
  hasVoicePermission,
}: {
  hasEmailPermission: boolean;
  hasSmsPermission: boolean;
  hasVoicePermission: boolean;
}) => {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [displayedCampaigns, setDisplayedCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>(
    hasEmailPermission
      ? "EMAIL"
      : hasSmsPermission
        ? "SMS"
        : hasVoicePermission
          ? "VOICE"
          : "",
  ); // Filtro por tipo

  // Cargar campañas al inicio

  const getChannelCampaigns = async (channelType: string) => {
      setLoading(true);
    try {
      const { data } = await axios.get("/api/campaigns", {
        params: { channelType },
      });
      return data.campaigns || [];
    } catch (error) {
      console.error("Error cargando campañas:", error);
       return []; 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFilteredCampaigns = async () => {
      const filtered = await getChannelCampaigns(selectedType);
      setFilteredCampaigns(filtered);
      setPage(1); // Reset a la primera página cuando cambia el filtro
    };

    fetchFilteredCampaigns();
  }, [selectedType]);

  // Calcular campañas a mostrar basado en la página actual
  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedCampaigns(filteredCampaigns.slice(startIndex, endIndex));
  }, [filteredCampaigns, page]);

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

  // Manejadores de navegación
  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // Cambiar tipo de campaña
  const handleTypeChange = (type: string) => {
    if (type !== selectedType) {
      setSelectedType(type);
    }
  };

  const channelOptions = [
    { type: "EMAIL", label: "EMAIL", visible: hasEmailPermission },
    { type: "SMS", label: "SMS", visible: hasSmsPermission },
    { type: "VOICE", label: "VOICE", visible: hasVoicePermission },
  ];

  const renderButtonClass = (type: string) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      selectedType === type
        ? "bg-orange-500 text-white"
        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
  }`;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Encabezado con filtros */}
      <div className="px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Campañas
          </h1>

          <div className="flex space-x-2">
            {channelOptions
              .filter(({ visible }) => visible)
              .map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={renderButtonClass(type)}
                >
                  {label}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 flex-grow overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {displayedCampaigns.map((campaign) => (
              <CampaniaCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 dark:text-gray-400">
              No hay campañas disponibles para {selectedType.toUpperCase()}
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {filteredCampaigns.length > 0 && (
        <div className="px-6 py-3 flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Página {page} de {totalPages} · Total: {filteredCampaigns.length}
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
                disabled={page >= totalPages}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaniasPage;
