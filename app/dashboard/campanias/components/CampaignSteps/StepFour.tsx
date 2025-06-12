"use client";

import axios from "axios";
import React, { useState } from "react";
import { useCampaign } from "@/app/dashboard/campanias/contexts/CampaignContext";
import { MdCheckCircle } from "react-icons/md";
import {
  FiPhone,
  FiGlobe,
  FiMail,
  FiMessageSquare,
  FiUsers,
  FiClock,
  FiZap,
  FiCalendar,
} from "react-icons/fi";

interface StepFourProps {
  onPrev: () => void;
  onClose: () => void;
}

const StepFour: React.FC<StepFourProps> = ({ onPrev, onClose }) => {
  const { campaign, resetCampaign } = useCampaign();
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getLanguageFlag = (lang: string) => {
    const langCode = lang.split("_")[0];
    switch (langCode) {
      case "en":
        return "🇺🇸";
      case "es":
        return "🇪🇸";
      case "pt":
        return "🇧🇷";
      case "fr":
        return "🇫🇷";
      case "de":
        return "🇩🇪";
      default:
        return "🌐";
    }
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleSubmit = async () => {
    setIsSending(true);

    const newCampaign = {
      name: campaign.name,
      type: campaign.type,
      templateId: campaign.template?.id,
      segmentId: campaign.segment?.segmentId
    };

    try {
      const { data } = await axios.post("/api/campaigns", { ...newCampaign });

      console.log({ data });
      setIsSuccess(true);
    } catch (error) {
      console.log({ error });
      setIsSuccess(false);
    } finally {
      setIsSending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <MdCheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          ¡Campaña enviada con éxito!
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Tu campaña se ha programado correctamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Revisa la información de tu campaña antes de enviarla.
      </p>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-5 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Información de la Campaña
          </h4>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Nombre:</span> {campaign.name}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Tipo de campaña:</span>{" "}
              {campaign.type === "EMAIL" ? (
                <span className="inline-flex items-center">
                  <FiMail className="mr-1" /> EMAIL
                </span>
              ) : campaign.type === "SMS" ? (
                <span className="inline-flex items-center">
                  <FiMessageSquare className="mr-1" /> SMS
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <FiPhone className="mr-1" /> VOICE
                </span>
              )}
            </p>
            {/* Mostrar información específica de EMAIL */}
            {campaign.type === "EMAIL" && (
              <>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Asunto:</span> {campaign.subject}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Email de remitente:</span>{" "}
                  {campaign.senderEmail}@confa.co
                </p>
              </>
            )}
          </div>
        </div>

        {/* <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Programación de la Campaña
          </h4>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Tipo de envío:</span>{" "}
              {campaign.schedulingType === "instantanea" ? (
                <span className="inline-flex items-center">
                  <FiZap className="mr-1 text-orange-500" /> Envío Instantáneo
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <FiClock className="mr-1 text-blue-500" /> Campaña Programada
                </span>
              )}
            </p>
            {campaign.schedulingType === "programar" && campaign.scheduledDate && (
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Fecha programada:</span>{" "}
                <span className="inline-flex items-center">
                  <FiCalendar className="mr-1" />
                  {new Date(campaign.scheduledDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </p>
            )}
          </div>
        </div> TODO DESCOMENTAR */}

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Segmento Seleccionado
          </h4>
          {campaign.segment ? (
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FiUsers className="mr-2" />
                <span>{campaign.segment.label}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="font-medium mr-2">Creado:</span>
                <span>{formatDate(campaign.segment.createdAt)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-500">
              No se ha seleccionado ningún segmento
            </p>
          )}
        </div>

        {campaign.type !== "VOICE" && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Plantilla Seleccionada
            </h4>
            {campaign.template ? (
              <div className="space-y-1 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Nombre:</span>{" "}
                  {campaign.template.name}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Creada:</span>{" "}
                  {new Date(campaign.template.createdAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-500">
                No se ha seleccionado ninguna plantilla
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          disabled={isSending}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSending}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              Enviando...
            </>
          ) : (
            "Enviar Campaña"
          )}
        </button>
      </div>
    </div>
  );
};

export default StepFour;

