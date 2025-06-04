"use client";

import React, { useState } from "react";
import {
  useCampaign,
  SchedulingType,
} from "@/app/dashboard/campanias/contexts/CampaignContext";
import { FiClock, FiZap, FiCalendar } from "react-icons/fi";

interface StepZeroProps {
  onNext: () => void;
}

const StepZero: React.FC<StepZeroProps> = ({ onNext }) => {
  const { campaign, updateCampaign } = useCampaign();
  const [errors, setErrors] = useState<{ scheduledDate?: string }>({});

  const handleNext = () => {
    const newErrors: { scheduledDate?: string } = {};

    // Validar que si se selecciona "programar", debe haber una fecha
    if (campaign.schedulingType === 'programar' && !campaign.scheduledDate) {
      newErrors.scheduledDate = "Debes seleccionar una fecha para la campaña programada";
    }

    // Validar que la fecha no sea en el pasado
    if (campaign.schedulingType === 'programar' && campaign.scheduledDate) {
      const now = new Date();
      const selectedDate = new Date(campaign.scheduledDate);
      
      // Comparar solo fechas (sin hora)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const selected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      
      if (selected < today) {
        newErrors.scheduledDate = "La fecha programada no puede ser anterior a hoy";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  const handleSchedulingTypeChange = (type: SchedulingType) => {
    updateCampaign({ 
      schedulingType: type,
      // Si cambia a instantánea, limpiar la fecha
      scheduledDate: type === 'instantanea' ? null : campaign.scheduledDate
    });
    setErrors({});
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value ? new Date(e.target.value) : null;
    updateCampaign({ scheduledDate: selectedDate });
    setErrors({});
  };

  // Formatear fecha para el input (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Obtener fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Programar Campaña
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Elige cuándo quieres enviar tu campaña.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Tipo de envío
        </label>
        <div className="space-y-3">
          {/* Opción Instantánea */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              campaign.schedulingType === 'instantanea'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onClick={() => handleSchedulingTypeChange('instantanea')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="instantanea"
                name="scheduling-type"
                value="instantanea"
                checked={campaign.schedulingType === 'instantanea'}
                onChange={() => handleSchedulingTypeChange('instantanea')}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <label htmlFor="instantanea" className="ml-3 flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <FiZap className="mr-2 text-orange-500" size={16} />
                <div>
                  <span className="font-medium">Envío Instantáneo</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    La campaña se enviará inmediatamente después de crearla
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Opción Programada */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              campaign.schedulingType === 'programar'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onClick={() => handleSchedulingTypeChange('programar')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="programar"
                name="scheduling-type"
                value="programar"
                checked={campaign.schedulingType === 'programar'}
                onChange={() => handleSchedulingTypeChange('programar')}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <label htmlFor="programar" className="ml-3 flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <FiClock className="mr-2 text-orange-500" size={16} />
                <div>
                  <span className="font-medium">Programar Fecha</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Programa la campaña para una fecha específica
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de fecha - solo se muestra si se selecciona "programar" */}
      {campaign.schedulingType === 'programar' && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <label 
            htmlFor="scheduled-date" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <FiCalendar className="inline mr-2" size={14} />
            Fecha de envío
          </label>
          <input
            type="date"
            id="scheduled-date"
            value={formatDateForInput(campaign.scheduledDate)}
            onChange={handleDateChange}
            min={getMinDate()}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white ${
              errors.scheduledDate
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-500"
            }`}
          />
          {errors.scheduledDate && (
            <p className="mt-1 text-sm text-red-500">{errors.scheduledDate}</p>
          )}
          
          {campaign.scheduledDate && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              La campaña se enviará el {new Date(campaign.scheduledDate).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default StepZero; 