"use client"

import React, { useState } from 'react';
import { MdClose, MdPerson, MdEmail, MdBusiness, MdSecurity } from 'react-icons/md';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  lastName: string;
  email: string;
  area: string;
  rol: string;
  password: string;
}

const areas = [
  "Marketing",
  "Finanzas",
];

const roles = [
  "admin",
  "emailsmsRead"
];

export default function CreateModal({ isOpen, onClose }: CreateModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastName: '',
    email: '',
    area: '',
    rol: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.name || !formData.lastName || !formData.email || !formData.area || !formData.rol || !formData.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Usuario creado exitosamente:', data);
      
      setFormData({
        name: '',
        lastName: '',
        email: '',
        area: '',
        rol: '',
        password: ''
      });
      
      onClose();
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      alert('Error al crear el usuario');
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      lastName: '',
      email: '',
      area: '',
      rol: '',
      password: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Crear Nuevo Usuario</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdPerson className="inline mr-2 text-gray-400" />
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="Ingresa el nombre"
              required
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdPerson className="inline mr-2 text-gray-400" />
              Apellido
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="Ingresa el apellido"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdEmail className="inline mr-2 text-gray-400" />
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="usuario@empresa.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdSecurity className="inline mr-2 text-gray-400" />
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="Contraseña"
              required
            />
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdBusiness className="inline mr-2 text-gray-400" />
              Área
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdSecurity className="inline mr-2 text-gray-400" />
              Rol
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
          <div className="flex space-x-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
            >
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 