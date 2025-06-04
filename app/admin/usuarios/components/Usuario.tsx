import React from 'react';
import { MdPerson, MdEmail, MdLocationOn, MdSecurity, MdEdit, MdDelete } from 'react-icons/md';

interface UsuarioProps {
  id: number;
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

export default function Usuario({ id, nombre, apellido, email, area, rol, onEdit }: UsuarioProps) {
  const handleEditClick = () => {
    if (onEdit) {
      onEdit({ id, nombre, apellido, email, area, rol });
    }
  };

  return (
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
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Eliminar usuario"
        >
          <MdDelete className="text-lg" />
        </button>
      </div>
    </div>
  );
}
