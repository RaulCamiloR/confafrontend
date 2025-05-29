"use client"

import React, { useState, useEffect } from "react";
import { MdPerson, MdAdd } from 'react-icons/md';
import ModalUsuario from './components/ModalUsuario';
import CreateModal from './components/CreateModal';
import Usuario from './components/Usuario';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  area: string;
  rol: string;
}

export default function UsuariosPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // useEffect para llamar a la API al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/get-users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const data = await response.json();
        
        console.log('✅ Respuesta:', data);

        if (data.ok && data.users) {
 
          const usuariosMapeados: Usuario[] = data.users.map((user: any, index: number) => ({
            id: index + 1,
            nombre: `${user.name} ${user.lastName}`,
            email: user.email,
            area: user.areaName || "No especificada", 
            rol: user.role?.name || "Usuario"
          }));
          
          setUsuarios(usuariosMapeados);
          console.log('👥 Usuarios mapeados:', usuariosMapeados);
        } else {
          console.warn('⚠️ No se encontraron usuarios en la respuesta');
        }
        
      } catch (error) {
        console.error('❌ Error al llamar a /api/get-users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditUser = (usuario: Usuario) => {
    console.log('🔧 Editando usuario:', usuario);
    setSelectedUser(usuario);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
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
          onClick={handleOpenCreateModal}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
        >
          <MdAdd className="text-xl" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Cargando usuarios...</div>
        </div>
      )}

      {/* Grid de usuarios */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <Usuario
                key={usuario.id}
                id={usuario.id}
                nombre={usuario.nombre}
                email={usuario.email}
                area={usuario.area}
                rol={usuario.rol}
                onEdit={handleEditUser}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <MdPerson className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron usuarios</p>
            </div>
          )}
        </div>
      )}

      {/* Modal para crear nuevo usuario */}
      <CreateModal 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseCreateModal} 
      />

      {/* Modal para editar usuario */}
      <ModalUsuario 
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal}
        usuarioData={selectedUser}
        isEditMode={true}
      />
    </div>
  );
}