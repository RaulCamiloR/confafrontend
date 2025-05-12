'use client'

import React, { useState, useEffect } from 'react'
import { useCampaign, Segment } from '@/app/dashboard/campanias/contexts/CampaignContext'
import { getSegmentos } from '@/functions/segmentos'

interface StepTwoProps {
  onNext: () => void;
  onPrev: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ onNext, onPrev }) => {
  const { campaign, updateCampaign } = useCampaign()
  const [error, setError] = useState<string>('')
  const [segments, setSegments] = useState<Segment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)
  const pageSize = 6
  
  // Función para cargar segmentos desde el backend con paginación
  const fetchSegments = async (pageNum: number) => {
    try {
      setIsLoading(true)
      setLoadError('')
      
      console.log(`Fetching segments: type=${campaign.type}, page=${pageNum}, pageSize=${pageSize}, forDropdown=false`)
      // Usamos forDropdown=false como en la página de contactos
      const data = await getSegmentos(campaign.type, pageNum, pageSize, false) as any
      console.log('API response:', data)
      
      // Verificar que data existe
      if (!data) {
        console.warn('La API devolvió una respuesta vacía')
        setSegments([])
        setHasNextPage(false)
        return
      }
      
      // Procesar los datos de manera similar a la página de contactos
      const segmentsArray = Array.isArray(data) ? data : (data.segments || [])
      
      // Adaptar los datos al formato que necesitamos
      const formattedSegments = segmentsArray.map((segment: any) => ({
        // Requerimos que value, label y createdAt no sean undefined
        value: segment.segmentId || segment.value || '',
        label: segment.segmentName || segment.label || '',
        createdAt: segment.createdAt || new Date().toISOString(),
        // Campos adicionales opcionales
        segmentId: segment.segmentId,
        segmentName: segment.segmentName,
        status: segment.status,
        channelType: segment.channelType,
        recordsProcessed: segment.recordsProcessed,
        startedAt: segment.startedAt,
        updatedAt: segment.updatedAt
      }))
      
      setSegments(formattedSegments)
      
      // Determinar si hay más páginas basado en la longitud de los resultados
      setHasNextPage(segmentsArray.length >= pageSize)
      
      console.log(`Page ${pageNum}: Received ${segmentsArray.length} items. Has next page: ${segmentsArray.length >= pageSize}`)
    } catch (err) {
      console.error('Error al cargar segmentos:', err)
      setLoadError('Error al cargar segmentos. Inténtalo de nuevo.')
      setSegments([])
      setHasNextPage(false)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Efecto para cargar segmentos cuando cambia la página o el tipo de campaña
  useEffect(() => {
    fetchSegments(page)
  }, [page, campaign.type])
  
  const handleNext = () => {
    if (!campaign.segment) {
      setError('Debes seleccionar un segmento')
      return
    }
    
    onNext()
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage(prev => prev + 1)
    }
  }

  const handleSegmentSelect = (segment: Segment) => {
    updateCampaign({ segment })
    setError('')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Selecciona un segmento para tu campaña.
      </p>
      
      {loadError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">{loadError}</p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Segmento
        </label>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <svg className="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-sm text-gray-500">Cargando segmentos...</span>
          </div>
        ) : (
          <>
            {segments.length === 0 ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No hay segmentos disponibles para el tipo de campaña {campaign.type}.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[300px] overflow-y-auto">
                  {segments.map((segment) => (
                    <li 
                      key={segment.value || segment.segmentId || ''}
                      className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        campaign.segment?.value === segment.value ? 'bg-orange-50 dark:bg-gray-700' : ''
                      }`}
                      onClick={() => handleSegmentSelect(segment)}
                    >
                      <div className="px-4 py-3 sm:px-6 flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {segment.label || segment.segmentName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Creado: {formatDate(segment.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-2 flex-shrink-0">
                          {campaign.segment?.value === segment.value && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                              Seleccionado
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </>
        )}
      </div>
      
      {/* Paginación del lado del servidor */}
      {!isLoading && segments.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={handlePrevPage}
            disabled={page <= 1 || isLoading}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Página {page}
          </span>
          <button 
            onClick={handleNextPage}
            disabled={!hasNextPage || isLoading}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Siguiente
          </button>
        </div>
      )}
      
      {campaign.segment && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Segmento Seleccionado
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <span>{campaign.segment.label || campaign.segment.segmentName}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Anterior
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          disabled={isLoading || !campaign.segment}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default StepTwo 