"use client"

import React from "react";
import Link from "next/link";
import { MdPeople, MdSettings, MdAssessment, MdDescription, MdSecurity, MdNotifications } from 'react-icons/md';

const adminCards = [
  {
    title: "Gestión de Usuarios",
    description: "Administrar usuarios del sistema",
    href: "/admin/usuarios",
    icon: MdPeople,
    color: "text-blue-500"
  }
];

export default function AdminPage() {
  return (
    <div className="flex flex-col p-8 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {adminCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors`}>
                <card.icon className={`text-3xl ${card.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}