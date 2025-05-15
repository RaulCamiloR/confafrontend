'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { CampaniaCard } from './components/CampaniaCard'
import axios from 'axios';

interface Campaign {
  id: string;
  name?: string;
  type: string;
  status: string;
  senders: any; // O define una interfaz específica si conoces la estructura
}

// Función para obtener campañas
const getCampanias = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaign/get-campaign`)
  const data = await response.json()
  return data
}

const CampaniasPage = () => {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [displayedCampaigns, setDisplayedCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedType, setSelectedType] = useState<string>('email') // Filtro por tipo
  const itemsPerPage = 9 // Mismo número que en la página de contactos
  
  // Cargar campañas al inicio
  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true)
      try {
      const { data } = await axios("/api/campaigns");
        setAllCampaigns(data.campaigns || [])
      } catch (error) {
        console.error('Error cargando campañas:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadCampaigns()
  }, [])
  
  // Filtrar campañas por tipo cuando cambie el filtro o las campañas
  useEffect(() => {
    const filtered = allCampaigns.filter(campaign => 
      campaign.type.toLowerCase() === selectedType.toLowerCase()
    )
    setFilteredCampaigns(filtered)
    setPage(1) // Reset a la primera página cuando cambia el filtro
  }, [allCampaigns, selectedType])
  
  // Calcular campañas a mostrar basado en la página actual
  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setDisplayedCampaigns(filteredCampaigns.slice(startIndex, endIndex))
  }, [filteredCampaigns, page])
  
  // Calcular total de páginas
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)
  
  // Manejadores de navegación
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1)
    }
  }
  
  // Cambiar tipo de campaña
  const handleTypeChange = (type: string) => {
    if (type !== selectedType) {
      setSelectedType(type)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Encabezado con filtros */}
      <div className="px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Campañas
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => handleTypeChange('email')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'email'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              EMAIL
            </button>
            <button
              onClick={() => handleTypeChange('sms')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'sms'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              SMS
            </button>
            <button
              onClick={() => handleTypeChange('voice')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'voice'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              VOICE
            </button>
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
            <p className="text-gray-500 dark:text-gray-400">No hay campañas disponibles para {selectedType.toUpperCase()}</p>
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
  )
}

export default CampaniasPage
