"use client"

import React, { useState } from 'react';
import { MdClose, MdPerson, MdEmail, MdBusiness, MdSecurity } from 'react-icons/md';

interface ModalUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  nombre: string;
  email: string;
  area: string;
  rol: string;
}

const areas = [
  "Desarrollo",
  "Recursos Humanos", 
  "Marketing",
  "Ventas",
  "Finanzas",
  "Operaciones",
  "Tecnología"
];

const roles = [
  "Administrador",
  "Supervisor", 
  "Desarrollador",
  "Editor",
  "Usuario"
];

export default function ModalUsuario({ isOpen, onClose }: ModalUsuarioProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    area: '',
    rol: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.area || !formData.rol) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Imprimir en consola
    console.log('Nuevo usuario:', formData);
    
    // Limpiar formulario
    setFormData({
      nombre: '',
      email: '',
      area: '',
      rol: ''
    });
    
    // Cerrar modal
    onClose();
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      email: '',
      area: '',
      rol: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Nuevo Usuario</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdPerson className="inline mr-2 text-gray-400" />
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ingresa el nombre completo"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdEmail className="inline mr-2 text-gray-400" />
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="usuario@empresa.com"
              required
            />
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdBusiness className="inline mr-2 text-gray-400" />
              Área
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Selecciona un área</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdSecurity className="inline mr-2 text-gray-400" />
              Rol
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}