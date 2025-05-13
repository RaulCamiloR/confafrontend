'use client'

import React, { useState, useEffect } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useCampaign } from '../contexts/CampaignContext'
import StepOne from './CampaignSteps/StepOne'
import StepTwo from './CampaignSteps/StepTwo'
import StepThree from './CampaignSteps/StepThree'
import StepFour from './CampaignSteps/StepFour'

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const { campaign, resetCampaign } = useCampaign()
  
  const totalSteps = campaign.type === 'VOZ' ? 3 : 4

  // Efecto para saltar al paso 4 si el tipo es VOZ y estamos en el paso 3
  useEffect(() => {
    if (currentStep === 3 && campaign.type === 'VOZ') {
      setCurrentStep(4)
    }
  }, [currentStep, campaign.type])

  if (!isOpen) return null

  const handleClose = () => {
    resetCampaign()
    setCurrentStep(1)
    onClose()
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Si estamos en el paso 2 y el tipo es VOZ, ir directamente al paso 4
      if (currentStep === 2 && campaign.type === 'VOZ') {
        setCurrentStep(4)
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      // Si estamos en el paso 4 y el tipo es VOZ, volver al paso 2
      if (currentStep === 4 && campaign.type === 'VOZ') {
        setCurrentStep(2)
      } else {
        setCurrentStep(currentStep - 1)
      }
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne onNext={nextStep} />
      case 2:
        return <StepTwo onNext={nextStep} onPrev={prevStep} />
      case 3:
        return campaign.type === 'VOZ' ? null : <StepThree onNext={nextStep} onPrev={prevStep} />
      case 4:
        return <StepFour onPrev={prevStep} onClose={handleClose} />
      default:
        return <StepOne onNext={nextStep} />
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Información de Campaña'
      case 2:
        return 'Seleccionar Segmento'
      case 3:
        return campaign.type === 'EMAIL' 
          ? 'Elegir Plantilla de Email' 
          : campaign.type === 'SMS'
            ? 'Elegir Plantilla de SMS'
            : 'Elegir Plantilla de Voz'
      case 4:
        return campaign.type === 'EMAIL'
          ? 'Revisar y Enviar Campaña de Email'
          : campaign.type === 'SMS'
            ? 'Revisar y Enviar Campaña de SMS'
            : 'Revisar y Enviar Campaña de Voz'
      default:
        return 'Nueva Campaña'
    }
  }

  const calculateProgress = () => {
    if (campaign.type === 'VOZ') {
      // Para VOZ tenemos 3 pasos: 1, 2 y 4
      switch (currentStep) {
        case 1:
          return 33; // 33% en el primer paso
        case 2:
          return 66; // 66% en el segundo paso
        case 4:
          return 100; // 100% en el último paso
        default:
          return 33;
      }
    } else {
      return (currentStep / 4) * 100;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl mx-auto flex flex-col max-h-[90vh] my-6">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {getStepTitle()}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
          <div 
            className="bg-orange-500 h-2 transition-all duration-300 ease-in-out"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
        
        {/* Step Content - agregando overflow-y-auto para permitir scroll */}
        <div className="p-6 overflow-y-auto flex-grow">
          {renderStep()}
        </div>
      </div>
    </div>
  )
}

export default CampaignModal 