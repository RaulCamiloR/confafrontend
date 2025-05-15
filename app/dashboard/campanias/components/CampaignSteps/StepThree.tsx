"use client";

import React, { useState, useEffect } from "react";
import { useCampaign } from "@/app/dashboard/campanias/contexts/CampaignContext";
import TemplatesList from "@/app/dashboard/plantillas/components/TemplatesList";
import { Template } from "@/app/dashboard/plantillas/contexts/TemplateContext";
import { MdCheckCircle, MdEmail } from "react-icons/md";
import { FiMail, FiMessageSquare, FiPhone } from "react-icons/fi";

interface StepThreeProps {
  onNext: () => void;
  onPrev: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ onNext, onPrev }) => {
  const { campaign, updateCampaign } = useCampaign();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTemplateSelect = (template: Template | any) => {
    console.log("Template seleccionado:", template);
    updateCampaign({ template });
    setError("");
  };

  const handleNext = () => {
    if (!campaign.template) {
      setError("Debes seleccionar una plantilla para continuar");
      return;
    }

    onNext();
  };

  // Obtener el ícono según el tipo de campaña
  const getCampaignTypeIcon = () => {
    switch (campaign.type) {
      case "EMAIL":
        return <FiMail className="mr-2" size={18} />;
      case "SMS":
        return <FiMessageSquare className="mr-2" size={18} />;
      case "VOICE":
        return <FiPhone className="mr-2" size={18} />;
      default:
        return <FiMail className="mr-2" size={18} />;
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "Fecha no disponible";
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 flex items-center">
            {getCampaignTypeIcon()}
            Plantilla de {campaign.type}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Selecciona una plantilla para tu campaña de{" "}
            {campaign.type.toLowerCase()}.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Plantilla seleccionada */}
      {campaign.template && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 flex items-center">
            <MdCheckCircle className="mr-2" size={18} />
            Plantilla Seleccionada
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MdEmail className="text-blue-500 mr-2" size={16} />
              <span className="font-medium">{campaign.template.name}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <span className="font-medium mr-2">Creada:</span>
              <span>{formatDate(campaign.template.createdAt)}</span>
            </div>
            {campaign.template?.isBackendTemplate && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-md">
                  Template del servidor
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">
            Plantillas disponibles
          </h4>
          {isLoading && (
            <div className="flex items-center">
              <svg
                className="animate-spin h-4 w-4 text-orange-500 mr-2"
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
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Cargando...
              </span>
            </div>
          )}
        </div>
        <div className="h-[250px] overflow-y-auto p-3">
          {campaign.type !== "VOICE" && (
            <TemplatesList
              onSelect={handleTemplateSelect}
              selectable={true}
              type={campaign.type}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-700 dark:hover:bg-red-600 text-white dark:text-white rounded-lg transition"
        >
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={!campaign.template || isLoading}
          className={`px-4 py-2 ${
            !campaign.template || isLoading
              ? "bg-orange-400 text-white opacity-70 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          } rounded-lg transition`}
        >
          {isLoading ? "Cargando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
};

export default StepThree;

