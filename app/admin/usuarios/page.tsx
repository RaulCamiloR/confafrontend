"use client"

import React, { useState } from "react";
import { MdPerson, MdEmail, MdBusiness, MdSecurity, MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import ModalUsuario from './components/ModalUsuario';

// Datos de ejemplo de usuarios
const usuarios = [
  {
    id: 1,
    nombre: "Milo",
    email: "camilo.rodriguez@cloudhesive.com",
    area: "Desarrollo",
    rol: "Desarrollador"
  }
];

const getRolColor = (rol: string) => {
  switch (rol) {
    case "Desarrollador":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function UsuariosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra los usuarios del sistema</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
        >
          <MdAdd className="text-xl" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Grid de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Header de la tarjeta */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <MdPerson className="text-2xl text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{usuario.nombre}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRolColor(usuario.rol)}`}>
                    {usuario.rol}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del usuario */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MdEmail className="text-lg text-gray-400" />
                <span>{usuario.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MdBusiness className="text-lg text-gray-400" />
                <span>{usuario.area}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MdSecurity className="text-lg text-gray-400" />
                <span>Rol: {usuario.rol}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <MdEdit className="text-lg" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <MdDelete className="text-lg" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ModalUsuario 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}