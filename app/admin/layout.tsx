"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdPeople, MdSettings, MdAssessment, MdDescription, MdExitToApp } from 'react-icons/md';

const adminNavItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: MdDashboard
  },
  {
    name: "Usuarios",
    href: "/admin/usuarios",
    icon: MdPeople
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full bg-[#2d3748] text-gray-300 p-4 flex flex-col w-64 z-30 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Panel de</h1>
          <h1 className="text-xl font-bold text-white">Administración</h1>
          <p className="text-sm text-gray-400 mt-1">Sistema de Gestión</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#3a4659] text-white"
                        : "hover:bg-[#3a4659] hover:text-white"
                    }`}
                  >
                    <item.icon className="text-xl flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Back to Dashboard Button */}
        <div className="mt-4">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-400 hover:bg-[#3a4659] hover:text-white"
          >
            <MdExitToApp className="text-xl flex-shrink-0" />
            <span>Volver</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Navbar */}
        <nav className="bg-gray-800 border-b border-gray-700 h-14 flex-shrink-0 text-gray-200 shadow-md">
          <div className="h-full px-4 md:px-6 py-2 flex justify-between items-center">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2">
                <MdSettings size={28} className="text-orange-500" />
                <span className="text-white font-semibold">Admin Panel</span>
              </Link>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <span className="text-sm text-gray-300">Administrador</span>
              <Link
                href="/"
                className="px-3 md:px-4 py-1 text-white bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
              >
                <MdExitToApp className="w-4 h-4" />
                <span className="hidden md:inline">Salir</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="h-full pb-14 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 