'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MdArrowBack, MdOutlineDescription, MdContacts, MdOutlineCampaign } from 'react-icons/md'

const DashboardPage = () => {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 min-h-screen pb-30">
      <div className="w-48 h-48 relative mb-1">
        <Image 
          src="/images/confa-logo.png" 
          alt="Confa Logo" 
          fill 
          priority
          className="object-contain"
        />
      </div>

      <h2 className="text-gray-600 dark:text-gray-300 text-center max-w-md -mt-2">
        Crea tus campañas de forma sencilla y dinamica
      </h2>
      
      <div className="flex flex-col items-center space-y-3 mt-4">
        <Link 
          href="/dashboard/plantillas" 
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition shadow-sm w-48 justify-center"
        >
          <MdOutlineDescription className="text-orange-500" />
          <span>Crear Plantilla</span>
        </Link>
        <Link 
          href="/dashboard/contactos" 
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition shadow-sm w-48 justify-center"
        >
          <MdContacts className="text-orange-500" />
          <span>Ver Contactos</span>
        </Link>
        <Link 
          href="/dashboard/campanias" 
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition shadow-sm w-48 justify-center"
        >
          <MdOutlineCampaign className="text-orange-500" />
          <span>Ver Campañas</span>
        </Link>
        <button 
          onClick={() => router.back()} 
          className="flex items-center justify-center space-x-2 text-white bg-blue-400 hover:bg-blue-500 px-6 py-2 rounded-lg transition-colors w-48"
        >
          <MdArrowBack className="text-xl" />
          <span>Volver</span>
        </button>
      </div>
    </div>
  )
}

export default DashboardPage;