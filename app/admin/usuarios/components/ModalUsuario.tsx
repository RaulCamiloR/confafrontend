"use client"

import React, { useState, useEffect } from 'react';
import { MdClose, MdPerson, MdEmail, MdBusiness, MdSecurity } from 'react-icons/md';
import axios from 'axios';
import { areas, roles } from '../constants/constants';

interface UsuarioData {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  area: string;
  rol: string;
}

interface ModalUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioData: UsuarioData;
}



export default function ModalUsuario({ isOpen, onClose, usuarioData }: ModalUsuarioProps) {
  // Estados para la edición
  const [selectedNombre, setSelectedNombre] = useState('');
  const [selectedApellido, setSelectedApellido] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedRol, setSelectedRol] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // useEffect para cargar los datos del usuario
  useEffect(() => {
    if (usuarioData) {
      console.log('📝 Cargando datos para editar:', usuarioData);
      setSelectedNombre(usuarioData.nombre);
      setSelectedApellido(usuarioData.apellido);
      setSelectedArea(usuarioData.area);
      setSelectedRol(usuarioData.rol);
    }
  }, [usuarioData]);

  const handleClose = () => {
    // Resetear estados al cerrar
    setSelectedNombre(usuarioData.nombre);
    setSelectedApellido(usuarioData.apellido);
    setSelectedArea(usuarioData.area);
    setSelectedRol(usuarioData.rol);
    onClose();
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedNombre(e.target.value);
  };

  const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedApellido(e.target.value);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
  };

  const handleRolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRol(e.target.value);
  };

  const handleEnviar = async() => {
    try {
      setIsLoading(true);
      console.log('📤 Enviando actualización...');
      console.log('Nombre editado:', selectedNombre);
      console.log('Apellido editado:', selectedApellido);
      
      const response = await axios.post('/api/edit-user', {
        id: usuarioData.id,
        email: usuarioData.email,
        area: selectedArea,
        rol: selectedRol,
        name: selectedNombre,
        lastName: selectedApellido
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      console.log('✅ Usuario actualizado exitosamente:', response.data);
      
      // Cerrar modal
      onClose();
      
      // Refrescar la página después de un breve delay
      setTimeout(() => {
        window.location.reload();
      }, 300);
      
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      alert('Error al actualizar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Editar Usuario</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Datos del usuario */}
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MdPerson className="text-lg text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">ID</p>
                <p className="font-medium text-gray-800">{usuarioData.id}</p>
              </div>
            </div>
            
            {/* Nombre - Input */}
            <div className="flex items-center space-x-3">
              <MdPerson className="text-lg text-orange-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Nombre</p>
                <input
                  type="text"
                  value={selectedNombre}
                  onChange={handleNombreChange}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nombre"
                />
              </div>
            </div>

            {/* Apellido - Input */}
            <div className="flex items-center space-x-3">
              <MdPerson className="text-lg text-orange-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Apellido</p>
                <input
                  type="text"
                  value={selectedApellido}
                  onChange={handleApellidoChange}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Apellido"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MdEmail className="text-lg text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800">{usuarioData.email}</p>
              </div>
            </div>

            {/* Área - Dropdown */}
            <div className="flex items-center space-x-3">
              <MdBusiness className="text-lg text-orange-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Área</p>
                <select
                  value={selectedArea}
                  onChange={handleAreaChange}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rol - Dropdown */}
            <div className="flex items-center space-x-3">
              <MdSecurity className="text-lg text-orange-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Rol</p>
                <select
                  value={selectedRol}
                  onChange={handleRolChange}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {roles.map((rol) => (
                    <option key={rol} value={rol}>
                      {rol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-gray-800 hover:bg-gray-900 text-white'
              }`}
            >
              Cerrar
            </button>
            <button
              onClick={handleEnviar}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                isLoading 
                  ? 'bg-orange-400 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600'
              } text-white`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}