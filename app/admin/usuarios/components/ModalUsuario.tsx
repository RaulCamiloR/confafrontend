"use client"

import React, { useState, useEffect } from 'react';
import { MdClose, MdPerson, MdEmail, MdBusiness, MdSecurity } from 'react-icons/md';
import axios from 'axios';

interface UsuarioData {
  id: number;
  nombre: string;
  email: string;
  area: string;
  rol: string;
}

interface ModalUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioData?: UsuarioData | null;
  isEditMode?: boolean;
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

export default function ModalUsuario({ isOpen, onClose, usuarioData, isEditMode = false }: ModalUsuarioProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastName: '',
    email: '',
    area: '',
    rol: '',
    password: ''
  });

  // Estados para el modo edición - DEBEN estar al nivel superior
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedRol, setSelectedRol] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // useEffect para cargar los datos del usuario cuando es modo edición
  useEffect(() => {
    if (isEditMode && usuarioData) {
      console.log('📝 Cargando datos para editar:', usuarioData);
      
      const nombreCompleto = usuarioData.nombre.split(' ');
      const name = nombreCompleto[0] || '';
      const lastName = nombreCompleto.slice(1).join(' ') || '';
      
      setFormData({
        name: name,
        lastName: lastName,
        email: usuarioData.email,
        area: usuarioData.area,
        rol: usuarioData.rol,
        password: '' 
      });


      setSelectedArea(usuarioData.area);
      setSelectedRol(usuarioData.rol);
    } else {

      setFormData({
        name: '',
        lastName: '',
        email: '',
        area: '',
        rol: '',
        password: ''
      });
      setSelectedArea('');
      setSelectedRol('');
    }
  }, [isEditMode, usuarioData]);

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
    if (!formData.name || !formData.email || !formData.area || !formData.rol) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (isEditMode) {
      console.log('✏️ Actualizando usuario:', { ...formData, id: usuarioData?.id });
      // Aquí iría la lógica para actualizar el usuario
      alert('Función de actualización pendiente de implementar');
    } else {
      console.log('➕ Creando nuevo usuario:', formData);
      const response = await axios.post('/api/create-user', formData);
      console.log({response});
    }
    
    // Limpiar formulario
    setFormData({
      name: '',
      lastName: '',
      email: '',
      area: '',
      rol: '',
      password: ''
    });
    
    // Cerrar modal
    onClose();
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

  // Funciones para el modo edición
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
      
      const response = await fetch('/api/edit-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante: incluye cookies de autenticación
        body: JSON.stringify({
          id: usuarioData?.id,
          email: usuarioData?.email,
          area: selectedArea,
          rol: selectedRol
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Usuario actualizado exitosamente:', data);
      
      // Cerrar modal
      onClose();
      
      // Refrecar la página después de un breve delay para que se vea que se cerró el modal
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

  // Si es modo edición, mostrar solo una tarjeta pequeña con datos
  if (isEditMode && usuarioData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Información del Usuario</h2>
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
              
              <div className="flex items-center space-x-3">
                <MdPerson className="text-lg text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Nombre completo</p>
                  <p className="font-medium text-gray-800 capitalize">{usuarioData.nombre}</p>
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
                  <span>Enviar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal original para crear usuario
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
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ingresa el nombre completo"
              required
            />
          </div>
          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdPerson className="inline mr-2 text-gray-400" />
              Apellido
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ingresa el apellido"
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
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdEmail className="inline mr-2 text-gray-400" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Contraseña"
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