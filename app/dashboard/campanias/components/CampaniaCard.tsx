'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface Campaign {
  id: string;
  name?: string;
  type: string;
  status: string;
  senders: any;
}

interface CampaniaCardProps {
  campaign: Campaign;
}

export const CampaniaCard = ({ campaign }: CampaniaCardProps) => {
  const router = useRouter()

  const handleClick = () => {
    // Navegar a la página de detalle de la campaña
    router.push(`/dashboard/campanias/${campaign.id}`)
  }

  return (
    <div 
      key={campaign.id} 
      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800 dark:text-white truncate max-w-[70%]">
          {campaign.name || "Sin nombre"}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          campaign.status === 'COMPLETED' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
            : campaign.status === 'PENDING'
            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
        }`}>
          {campaign.status}
        </span>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>Tipo: {campaign.type.toUpperCase()}</p>
        <p>ID: {campaign.id.substring(0, 8)}...</p>
        {/* Si senders tiene alguna información relevante, se puede mostrar aquí */}
      </div>
    </div>
  )
} 