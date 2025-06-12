import React, { useState } from "react";
import {
  MdEmail,
  MdDelete,
  MdEdit,
  MdContentCopy,
  MdSms,
  MdFileCopy 
} from "react-icons/md";
import { useTemplateEditor } from "../hooks/useTemplateEditor";


interface SingleTemplateProps {
  template: any;
  isBackend?: boolean;
  onDelete?: (id: string) => void;
  onSelect?: (template: any) => void;
  isSelected?: boolean;
  selectable?: boolean;
  fetchTemplates: () => Promise<void>;

}

const SingleTemplate: React.FC<SingleTemplateProps> = ({
  template,
  isBackend = false,
  onDelete,
  onSelect,
  isSelected = false,
  selectable = false,
  fetchTemplates
}) => {
const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

const { duplicateTemplateFromList,notification } = useTemplateEditor({
    defaultContent: template?.design,
    name: template?.name,
  });
  
  const handleSelect = () => {
    if (selectable && onSelect) {
      onSelect(template);
    }
  };

  const onClickDuplicate = async(e: React.MouseEvent<HTMLButtonElement>)=>{
     e.stopPropagation();
    setDuplicatingId(template.id);
    try {
      const success = await duplicateTemplateFromList(template);
      if (success) {
        await fetchTemplates();
      }
    } catch (error) {
      // Manejo adicional si querés
      console.error("Error duplicando:", error);
    } finally {
      setDuplicatingId(null);
    }
  }

  // Determinar el nombre del template según el origen (contexto o backend)
  const templateName = isBackend
    ? template.TemplateName || template.name
    : template.name;

  // Determinar el ID según el origen
  const templateId = isBackend ? template.Id || template.id : template.id;

  // Determinar la fecha si está disponible
  const hasCreatedAt = isBackend ? !!template.CreatedAt : true;
  const createdAt =
    isBackend && template.CreatedAt
      ? new Date(template.CreatedAt).toLocaleDateString()
      : !isBackend
        ? new Date(template.createdAt).toLocaleDateString()
        : null;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
        isSelected
          ? "border-orange-500"
          : "border-gray-200 dark:border-gray-700"
      } hover:shadow-md transition-shadow ${selectable ? "cursor-pointer" : ""} min-w-80`}
      onClick={handleSelect}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {template.type === "SMS" && (
              <MdSms
                className={`${isBackend ? "text-blue-500" : "text-orange-500"} mr-2`}
                size={18}
              />
            )}
            {template.type === "EMAIL" && (
              <MdEmail
                className={`${isBackend ? "text-blue-500" : "text-orange-500"} mr-2`}
                size={18}
              />
            )}
            <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">
              {templateName}
            </h3>
          </div>
          <div className="flex space-x-1">
            {!isBackend && (
              <button
                className="p-1 text-gray-500 hover:text-orange-500 dark:text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                  // Acción de editar
                  console.log("Editar template:", template);
                  
                }}
              >
                <MdEdit size={18} />
              </button>
            )}

            {isBackend && (
              <div className="relative group inline-block">
                <button
                  className="p-1 text-gray-500 hover:text-orange-500 dark:text-gray-400"
                  onClick={onClickDuplicate}
                  disabled={duplicatingId === template.id}
                >
                  {duplicatingId === template.id ? (
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MdFileCopy size={18} />
                  )}
                </button>

                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                  Duplicar template
                </div>
                {notification && (
                  <div
                    className={`absolute bottom-full mb-10 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md shadow-md text-sm flex items-center z-10 whitespace-nowrap
                      ${
                        notification.type === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    {notification.type === "success" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {notification.message}
                  </div>
                )}
              </div>
            )}

            {false ? (
              <button
                className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Detalles del template del backend:", template);
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
          {hasCreatedAt && createdAt
            ? `Creado: ${createdAt}`
            : "Template del servidor"}
        </p>
      </div>
      <div className="bg-white rounded-b-lg dark:border-white border">
        <iframe srcDoc={template?.html} className="w-full h-80"></iframe>
      </div>
    </div>
  );
};

export default SingleTemplate;

