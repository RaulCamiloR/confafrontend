"use client"

import React, { useState, useEffect } from 'react';
import { MdClose, MdSecurity, MdDescription, MdAdd } from 'react-icons/md';
import axios from 'axios';

interface Module {
  name: string;
  description: string;
}

interface RolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RolModal({ isOpen, onClose }: RolModalProps) {
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  // Debug: verificar la inicialización del estado
  useEffect(() => {
    console.log('🔍 selectedModules cambió:', selectedModules);
    console.log('🔍 Tipo:', typeof selectedModules, 'Es array?:', Array.isArray(selectedModules));
  }, [selectedModules]);

  // useEffect para llamar a la API cuando se abra el modal
  useEffect(() => {
    if (isOpen) {
      const fetchModules = async () => {
        try {
          setLoading(true);
          console.log('📤 Llamando a /api/get-modules...');
          
          const response = await axios.get('/api/get-modules', {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('✅ Respuesta de /api/get-modules:', response.data);
          
          if (response.data.modules && Array.isArray(response.data.modules)) {
            setModules(response.data.modules);
          }
          
        } catch (error) {
          console.error('❌ Error al llamar a /api/get-modules:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchModules();
    }
  }, [isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleModuleToggle = (moduleName: string) => {
    console.log('🔄 Toggling module:', moduleName);
    console.log('🔍 selectedModules antes del toggle:', selectedModules);
    
    setSelectedModules(prev => {
      console.log('🔍 prev en setSelectedModules:', prev);
      
      if (prev.includes(moduleName)) {
        // Si ya está seleccionado, lo removemos
        const newModules = prev.filter(module => module !== moduleName);
        console.log('➖ Removiendo módulo. Nuevo array:', newModules);
        return newModules;
      } else {
        // Si no está seleccionado, lo agregamos
        const newModules = [...prev, moduleName];
        console.log('➕ Agregando módulo. Nuevo array:', newModules);
        return newModules;
      }
    });
  };

  const handleCreate = async () => {
    // Validación básica
    if (!name.trim() || !description.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (!selectedModules || selectedModules.length === 0) {
      alert('Por favor selecciona al menos un módulo');
      return;
    }

    // Asegurar que selectedModules sea un array válido
    const modulesArray = Array.isArray(selectedModules) ? selectedModules : [];
    
    const rolObject = {
      name: name.trim(),
      description: description.trim(),
      module: modulesArray
    };

    try {
      setCreating(true);
      console.log('📝 Creando rol:', rolObject);
      console.log('🔍 selectedModules antes de enviar:', selectedModules);
      console.log('🔍 modulesArray que se enviará:', modulesArray);
      console.log('🔍 Tipo de modulesArray:', typeof modulesArray, 'Es array?:', Array.isArray(modulesArray));

      const response = await axios.post('/api/create-role', rolObject, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      console.log('✅ Rol creado exitosamente:', response.data);
      
      // Limpiar formulario
      setName('');
      setDescription('');
      setSelectedModules([]);
      
      // Cerrar modal
      onClose();
      
      // Refrescar la página después de un breve delay
      setTimeout(() => {
        window.location.reload();
      }, 300);
      
    } catch (error) {
      console.error('❌ Error al llamar a /api/create-role:', error);
      alert('Error al crear el rol. Por favor intenta nuevamente.');
    } finally {
      setCreating(false);
    }
  };

  const handleConsoleLog = () => {
    // Asegurar que selectedModules sea un array válido
    const modulesArray = Array.isArray(selectedModules) ? selectedModules : [];
    
    const rolObject = {
      name: name.trim(),
      description: description.trim(),
      module: modulesArray
    };

    console.log('🖥️ ===== CONSOLE DEBUG =====');
    console.log('📋 Payload que se enviaría a /api/create-role:');
    console.log(JSON.stringify(rolObject, null, 2));
    console.log('🔍 Detalles del estado actual:');
    console.log('  - name:', `"${name}"`);
    console.log('  - description:', `"${description}"`);
    console.log('  - selectedModules:', selectedModules);
    console.log('  - modulesArray (lo que va al API):', modulesArray);
    console.log('  - Tipo de selectedModules:', typeof selectedModules);
    console.log('  - Es selectedModules un array?:', Array.isArray(selectedModules));
    console.log('  - Cantidad de módulos seleccionados:', modulesArray.length);
    console.log('🖥️ ========================');
  };

  const handleClose = () => {
    if (creating) return; // Prevenir cerrar durante la creación
    
    // Limpiar campos al cerrar
    setName('');
    setDescription('');
    setSelectedModules([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Crear Rol</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdSecurity className="inline mr-2 text-gray-400" />
              Nombre del Rol
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Ingresa el nombre del rol"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdDescription className="inline mr-2 text-gray-400" />
              Descripción
            </label>
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Ingresa la descripción del rol"
              required
            />
          </div>

          {/* Modules Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdAdd className="inline mr-2 text-gray-400" />
              Módulos ({selectedModules.length} seleccionados)
            </label>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500">Cargando módulos...</div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {modules.length > 0 ? (
                  modules.map((module) => (
                    <button
                      key={module.name}
                      onClick={() => handleModuleToggle(module.name)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedModules.includes(module.name)
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={module.description}
                    >
                      {module.name}
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 py-2">No hay módulos disponibles</div>
                )}
              </div>
            )}
            
            {selectedModules.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-600 mb-1">Módulos seleccionados:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedModules.map((moduleName) => (
                    <span
                      key={moduleName}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                    >
                      {moduleName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleConsoleLog}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
          >
            Console
          </button>
          <button
            onClick={handleClose}
            disabled={loading || creating}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              loading || creating
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || creating}
            className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center space-x-2 ${
              loading || creating
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Cargando módulos...</span>
              </>
            ) : creating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creando rol...</span>
              </>
            ) : (
              <span>Crear</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 