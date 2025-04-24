'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  MdDashboard, 
  MdCampaign, 
  MdContacts, 
  MdInsertChart, 
  MdSettings, 
  MdClose,
  MdEmail 
} from 'react-icons/md'
import { useSidebar } from '../context/SidebarContext'
import LogoutButton from './LogoutButton'
const menuItems = [
  { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
  { name: 'Campañas', icon: MdCampaign, path: '/dashboard/campanias' },
  { name: 'Contactos', icon: MdContacts, path: '/dashboard/contactos' },
  { name: 'Reportes', icon: MdInsertChart, path: '/dashboard/reportes' },
  { name: 'Configuración', icon: MdSettings, path: '/dashboard/configuracion' },
  { name: 'Plantillas', icon: MdEmail, path: '/dashboard/plantillas' },
]


const Sidebar = () => {
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-[#2d3748] text-gray-300 p-4 flex flex-col
        w-64 z-30 transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:h-screen
      `}>
        {/* Header with close button for mobile */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Sistema de</h1>
            <h1 className="text-xl font-bold text-white">Campañas</h1>
            <p className="text-sm text-gray-400 mt-1">Amazon Connect</p>
          </div>
          <button 
            onClick={close}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    onClick={() => close()} // Close sidebar on mobile when navigating
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-[#3a4659] text-white' 
                        : 'hover:bg-[#3a4659] hover:text-white'
                    }`}
                  >
                    <item.icon className="text-xl flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <LogoutButton />
      </div>
    </>
  )
}

export default Sidebar