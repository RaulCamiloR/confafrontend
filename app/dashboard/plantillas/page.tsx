'use client'

import React, { useState } from 'react'
import Plantilla from '@/components/Plantilla'
import TemplatesList from '@/components/TemplatesList'

type TemplateType = 'EMAIL' | 'SMS';

const PlantillasPage = () => {
  const [showEditor, setShowEditor] = useState(false)
  const [templateType, setTemplateType] = useState<TemplateType>('EMAIL')

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex justify-between items-center mb-6">
        {templateType === 'EMAIL' ? (
          <button
            onClick={() => setShowEditor(!showEditor)}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            {showEditor ? 'Ver Plantillas Guardadas' : 'Crear Nueva Plantilla'}
          </button>
        ) : (
          <div></div> // Espacio vacío cuando se selecciona SMS para mantener el layout
        )}
        
        {/* Selector de tipo de plantilla */}
        <div className="flex space-x-2">
          <button
            onClick={() => setTemplateType('EMAIL')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              templateType === 'EMAIL'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            EMAIL
          </button>
          <button
            onClick={() => setTemplateType('SMS')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              templateType === 'SMS'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            SMS
          </button>
        </div>
      </div>

      {templateType === 'SMS' ? (
        // Mensaje "Próximamente" para plantillas SMS
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-8xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Próximamente</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            Estamos trabajando en el editor de plantillas SMS. ¡Vuelve pronto para disfrutar de esta funcionalidad!
          </p>
        </div>
      ) : (
        // Editor de plantillas EMAIL (comportamiento original)
        showEditor ? (
          <div className="h-[calc(100vh-160px)]">
            <Plantilla />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Plantillas de Email Guardadas
            </h2>
            <TemplatesList />
          </div>
        )
      )}
    </div>
  )
}

export default PlantillasPage