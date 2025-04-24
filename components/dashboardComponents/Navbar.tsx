'use client'

import React, { useState } from 'react'
import { MdMenu, MdContacts, MdCampaign, MdExitToApp } from 'react-icons/md'
import { useSidebar } from '../context/SidebarContext'
import Modal from './Modal'
import CampaignModal from './CampaignModal'
import useUserStore from '@/stores/userStore';
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const { toggle } = useSidebar()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
  const router = useRouter()

  const user = useUserStore((state) => state.user);

  const handleNewContact = () => {
    setIsContactModalOpen(true)
  } 

  const handleNewCampaign = () => {
    setIsCampaignModalOpen(true)
  }

  const closeContactModal = () => {
    setIsContactModalOpen(false)
  }

  const closeCampaignModal = () => {
    setIsCampaignModalOpen(false)
  }

  const handleExit = () => {
    router.push('/')
  }

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700 h-14 flex-shrink-0 text-gray-200 shadow-md">
        <div className="h-full px-4 md:px-6 py-2 flex justify-between items-center">
          {/* Left section with menu button and title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggle}
              className="md:hidden text-gray-300 hover:text-white transition-colors"
            >
              <MdMenu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-100">
            {`${user?.name ? user?.name : 'Cerrando sesión...'}`}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              className="px-3 md:px-4 py-1 text-white bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
              onClick={handleNewContact}
            >
              <MdContacts className="w-4 h-4" />
              <span className="hidden md:inline">Nuevos Contactos</span>
            </button>
            
            <button
              className="px-3 md:px-4 py-1 text-white bg-[#0091E0] hover:bg-white hover:text-[#0091E0] rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
              onClick={handleNewCampaign}
            >
              <MdCampaign className="w-4 h-4" />
              <span className="hidden md:inline">Nueva Campaña</span>
            </button>

            <button
              className="px-3 md:px-4 py-1 text-white bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
              onClick={handleExit}
              title="Salir del dashboard"
            >
              <MdExitToApp className="w-4 h-4" />
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Modales */}
      <Modal 
        isOpen={isContactModalOpen} 
        onClose={closeContactModal} 
        title="Nuevos Contactos"
      />

      <CampaignModal
        isOpen={isCampaignModalOpen}
        onClose={closeCampaignModal}
      />
    </>
  )
}

export default Navbar