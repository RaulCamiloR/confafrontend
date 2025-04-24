'use client'

import React from 'react'
import { useParams } from 'next/navigation'

const SegmentPage = () => {
  const params = useParams()
  const id = params?.id as string

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Detalle del Segmento
      </h1>
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 max-w-lg w-full">
        <p className="text-gray-700 dark:text-gray-300 text-center">
          ID del segmento: <span className="font-mono font-medium">{id}</span>
        </p>
      </div>
    </div>
  )
}

export default SegmentPage