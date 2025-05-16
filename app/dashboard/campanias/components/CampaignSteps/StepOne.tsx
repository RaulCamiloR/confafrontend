'use client'

import React, { useState } from 'react'
import { useCampaign, CampaignType, CHANNEL_TYPES } from '@/app/dashboard/campanias/contexts/CampaignContext'
import { FiMail, FiMessageSquare, FiPhone } from 'react-icons/fi'

interface StepOneProps {
  onNext: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ onNext }) => {
  const { campaign, updateCampaign } = useCampaign()
  const [errors, setErrors] = useState<{name?: string, email?: string}>({})

  const handleNext = () => {
    const newErrors: {name?: string, email?: string} = {}
    
    if (!campaign.name.trim()) {
      newErrors.name = 'El nombre de la campaña es obligatorio'
    }
    
    // // Solo validar email si el tipo de campaña es 'EMAIL'
    // if (campaign.type === 'EMAIL') {
    //   if (!campaign.email.trim()) {
    //     newErrors.email = 'El email es obligatorio'
    //   } else if (!/^\S+@\S+\.\S+$/.test(campaign.email)) {
    //     newErrors.email = 'Email inválido'
    //   }
    // }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    onNext()
  }

  const handleTypeChange = (type: CampaignType) => {
    updateCampaign({ type })
  }

  // Función para obtener el icono según el tipo de campaña
  const getTypeIcon = (type: CampaignType) => {
    switch(type) {
      case 'EMAIL':
        return <FiMail className="mr-1" />;
      case 'SMS':
        return <FiMessageSquare className="mr-1" />;
      case 'VOICE':
        return <FiPhone className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Ingresa la información básica de tu campaña.
      </p>
      
      <div>
        <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre de Campaña
        </label>
        <input
          type="text"
          id="campaign-name"
          value={campaign.name}
          onChange={(e) => updateCampaign({ name: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Ej: Campaña de Navidad 2023"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tipo de Campaña
        </label>
        <div className="flex space-x-4 flex-wrap">
          {CHANNEL_TYPES.map((type) => (
            <div className="flex items-center mb-2 mr-4" key={type}>
              <input
                type="radio"
                id={`type-${type.toLowerCase()}`}
                name="campaign-type"
                value={type}
                checked={campaign.type === type}
                onChange={() => handleTypeChange(type)}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <label htmlFor={`type-${type.toLowerCase()}`} className="ml-2 flex items-center text-sm text-gray-700 dark:text-gray-300">
                {getTypeIcon(type)} {type}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/*campaign.type === 'EMAIL' && (
        <div>
          <label htmlFor="campaign-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email de Remitente
          </label>
          <input
            type="email"
            id="campaign-email"
            value={campaign.email}
            onChange={(e) => updateCampaign({ email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ej: marketing@tuempresa.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      )*/}
      
      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default StepOne 
