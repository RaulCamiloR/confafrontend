import React from 'react';
import { MdEmail, MdDelete, MdEdit, MdContentCopy } from 'react-icons/md';
import { Template } from '../context/TemplateContext';

interface SingleTemplateProps {
  template: any;
  isBackend?: boolean;
  onDelete?: (id: string) => void;
  onSelect?: (template: any) => void;
  isSelected?: boolean;
  selectable?: boolean;
}

const SingleTemplate: React.FC<SingleTemplateProps> = ({ 
  template,
  isBackend = false,
  onDelete,
  onSelect,
  isSelected = false,
  selectable = false
}) => {
  const handleSelect = () => {
    if (selectable && onSelect) {
      onSelect(template);
    }
  };

  // Determinar el nombre del template según el origen (contexto o backend)
  const templateName = isBackend ? (template.TemplateName || template.name) : template.name;
  
  // Determinar el ID según el origen
  const templateId = isBackend ? (template.Id || template.id) : template.id;
  
  // Determinar la fecha si está disponible
  const hasCreatedAt = isBackend ? !!template.CreatedAt : true;
  const createdAt = isBackend && template.CreatedAt 
    ? new Date(template.CreatedAt).toLocaleDateString()
    : !isBackend ? new Date(template.createdAt).toLocaleDateString() : null;

  return (
    <div 
      className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border ${
        isSelected ? 'border-orange-500' : 'border-gray-200 dark:border-gray-700'
      } hover:shadow-md transition-shadow ${selectable ? 'cursor-pointer' : ''}`}
      onClick={handleSelect}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <MdEmail className={`${isBackend ? 'text-blue-500' : 'text-orange-500'} mr-2`} size={18} />
          <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">{templateName}</h3>
        </div>
        <div className="flex space-x-1">
          {!isBackend && (
            <button 
              className="p-1 text-gray-500 hover:text-orange-500 dark:text-gray-400"
              onClick={(e) => {
                e.stopPropagation(); 
                // Acción de editar
                console.log('Editar template:', template);
              }}
            >
              <MdEdit size={18} />
            </button>
          )}
          
          {isBackend ? (
            <button 
              className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Detalles del template del backend:', template);
              }}
            >
              <MdContentCopy size={18} />
            </button>
          ) : (
            onDelete && (
              <button 
                className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400"
                onClick={(e) => {
                  e.stopPropagation(); 
                  onDelete(templateId);
                }}
              >
                <MdDelete size={18} />
              </button>
            )
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {hasCreatedAt && createdAt ? `Creado: ${createdAt}` : "Template del servidor"}
      </p>
    </div>
  );
};

export default SingleTemplate;