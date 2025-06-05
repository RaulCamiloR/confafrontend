import React, { useState } from 'react';
import { MdPerson, MdEmail, MdLocationOn, MdSecurity, MdEdit, MdDelete, MdClose, MdWarning } from 'react-icons/md';
import axios from 'axios';

interface UsuarioProps {
  nombre: string;
  apellido: string;
  email: string;
  area: string;
  rol: string;
  onEdit?: (usuario: UsuarioProps) => void;
}

const getRolColor = (rol: string) => {
  switch (rol.toLowerCase()) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "usuario":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Usuario({ nombre, apellido, email, area, rol, onEdit }: UsuarioProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleEditClick = () => {
    if (onEdit) {
      onEdit({ nombre, apellido, email, area, rol });
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      setShowConfirmModal(false);
      console.log('🗑️ Eliminando usuario:', email);
      
      const response = await axios.delete('/api/delete-user', {
        data: { email },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      console.log('✅ Usuario eliminado exitosamente:', response.data);
      
      // Refrescar la página después de eliminar
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario. Por favor intenta de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Header de la tarjeta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <MdPerson className="text-2xl text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                {nombre} {apellido}
              </h3>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRolColor(rol)}`}>
                {rol}
              </span>
            </div>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <MdEmail className="text-lg text-gray-400" />
            <span className="truncate">{email}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <MdLocationOn className="text-lg text-gray-400" />
            <span>Area: {area}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <MdSecurity className="text-lg text-gray-400" />
            <span>Rol: {rol}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={handleEditClick}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar usuario"
          >
            <MdEdit className="text-lg" />
          </button>
          <button 
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className={`p-2 transition-colors rounded-lg ${
              isDeleting 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
            title={isDeleting ? "Eliminando..." : "Eliminar usuario"}
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
            ) : (
              <MdDelete className="text-lg" />
            )}
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <MdWarning className="text-2xl text-red-500" />
                <h2 className="text-lg font-semibold text-gray-800">Confirmar Eliminación</h2>
              </div>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MdClose size={20} />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-4">
              <p className="text-gray-600 mb-2">
                ¿Estás seguro de que deseas eliminar al usuario?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="font-medium text-gray-800">
                  {nombre} {apellido}
                </p>
                <p className="text-sm text-gray-600">
                  {email}
                </p>
              </div>
              <p className="text-sm text-red-600 font-medium">
                ⚠️ Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Botones */}
            <div className="flex space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
