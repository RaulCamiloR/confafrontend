'use client'

import React, { useState } from 'react'
import { MdMenu, MdContacts, MdCampaign, MdExitToApp } from 'react-icons/md'
import { useSidebar } from '../context/SidebarContext'
import Modal from '@/app/dashboard/contactos/components/Modal'
import CampaignModal from '@/app/dashboard/campanias/components/CampaignModal'
import useUserStore from '@/stores/userStore';
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
          {/* Left section with menu button and icon */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggle}
              className="md:hidden text-gray-300 hover:text-white transition-colors"
            >
              <MdMenu size={24} />
            </button>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <MdCampaign size={28} className="text-orange-500" />
            </Link>
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