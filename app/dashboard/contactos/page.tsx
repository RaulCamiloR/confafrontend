'use client'

import React, { useState, useEffect } from 'react'
import { getSegmentos } from '@/functions/segmentos'
import { Segmentos } from '@/components/segmentos/Segmentos'

interface Segment {
  segmentId: string;
  segmentName: string;
  status: string;
  channelType: string;
  recordsProcessed: number;
  startedAt: string;
  createdAt: string;
  updatedAt: string;
}

type ChannelType = 'EMAIL' | 'VOZ' | 'SMS';

const ContactosPage = () => {
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [channelType, setChannelType] = useState<ChannelType>('EMAIL')
  const pageSize = 9
  
  const fetchSegments = async (pageNum: number, channel: ChannelType) => {
    setLoading(true)
    try {
      const data = await getSegmentos(channel, pageNum, pageSize, false) as any
      console.log('Datos recibidos:', data)
      
      // Manejar los datos recibidos
      if (data) {
        // Si la respuesta devuelve segmentos directamente o está dentro de una propiedad 'segments'
        const segmentsArray = Array.isArray(data) ? data : (data.segments || [])
        setSegments(segmentsArray)
        
        // Determinar si hay más páginas disponibles
        // Si recibimos menos elementos que el tamaño de página, asumimos que no hay más
        setHasNextPage(segmentsArray.length >= pageSize)
      }
    } catch (error) {
      console.error('Error al cargar segmentos:', error)
      setSegments([])
      setHasNextPage(false)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchSegments(page, channelType)
  }, [page, channelType])
  
  const handleNextPage = () => {
    if (segments.length > 0 && hasNextPage) {
      setPage(prev => prev + 1)
    }
  }
  
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
      // Al volver a la página anterior, asumimos que puede haber una siguiente
      setHasNextPage(true)
    }
  }

  const handleChannelChange = (channel: ChannelType) => {
    if (channel !== channelType) {
      setChannelType(channel)
      setPage(1) // Reset a la primera página cuando cambia el filtro
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Segmentos
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => handleChannelChange('EMAIL')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                channelType === 'EMAIL'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              EMAIL
            </button>
            <button
              onClick={() => handleChannelChange('VOZ')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                channelType === 'VOZ'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              VOZ
            </button>
            <button
              onClick={() => handleChannelChange('SMS')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                channelType === 'SMS'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              SMS
            </button>
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
            <p className="text-gray-500 dark:text-gray-400">No hay segmentos disponibles para {channelType}</p>
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
  )
}

export default ContactosPage