"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useTemplates, Template } from "../contexts/TemplateContext";
import { MdEmail, MdDelete, MdEdit, MdContentCopy } from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SingleTemplate from "./SingleTemplate";
import { TemplateType } from "../constants/plantillas";

interface TemplatesListProps {
  onSelect?: (template: Template | any) => void;
  selectable?: boolean;
  type?: TemplateType;
}

const TemplatesList: React.FC<TemplatesListProps> = ({
  onSelect,
  selectable = false,
  type,
}) => {
  const { templates, selectTemplate, selectedTemplate, deleteTemplate } =
    useTemplates();
  const [loadedTemplates, setLoadedTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBackendTemplate, setSelectedBackendTemplate] = useState<
    any | null
  >(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const templatesPerPage: number = 9;

  // Cargar los templates desde el backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/get-templates");

        // Mostrar los templates en la consola
        // console.log("Templates obtenidos del backend:", data);

        // Formatear los templates del backend para que tengan una estructura similar a los locales
        const formattedTemplates = (data || []).map((template: any) => ({
          id:
            template.Id ||
            template.id ||
            `backend-${Date.now()}-${Math.random()}`,
          name: template.TemplateName || template.name || "Template sin nombre",
          html: atob(template?.content ?? template?.message) || "",
          createdAt: template.CreatedAt || new Date().toISOString(),
          isBackendTemplate: true,
          type: (template.channel || "email").toUpperCase() as TemplateType,
          originalData: template,
        }));

        setLoadedTemplates(formattedTemplates);
      } catch (err) {
        console.error("Error al cargar templates:", err);
        setError("Error al cargar los templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();

    // Mostrar los templates en contexto al montar el componente
    // console.log("Templates en contexto:", templates);
  }, []);

  const handleSelect = (template: Template | any) => {
    // Si es un template del backend, manejarlo de manera especial
    if (template.isBackendTemplate) {
      setSelectedBackendTemplate(template);

      // Crear una versión del template que sea compatible con la interfaz Template
      const compatibleTemplate: Template = {
        id: template.id,
        name: template.name,
        html: template.html || "",
        design: template.design || {},
        createdAt: new Date(template.createdAt),
        type: template.type || "EMAIL",
      };

      if (onSelect) {
        onSelect(compatibleTemplate);
      }
    } else {
      // Para templates locales, usar el flujo normal
      selectTemplate(template);
      if (onSelect) {
        onSelect(template);
      }
    }
  };

  // Combinar los templates de ambas fuentes para la paginación y filtrar por tipo si es necesario
  const allTemplates = [...templates, ...loadedTemplates].filter(
    (template) =>
      !type ||
      template.type === type ||
      (template.originalData?.Channel || "").toUpperCase() === type,
  );

  // Calcular el total de páginas
  const totalPages = Math.ceil(allTemplates.length / templatesPerPage);

  // Obtener los templates para la página actual
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = allTemplates.slice(
    indexOfFirstTemplate,
    indexOfLastTemplate,
  );

  // console.log(currentTemplates);

  // Navegación entre páginas
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-500 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (allTemplates.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          No hay templates {type ? `de ${type}` : ""} guardados
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Crea y guarda templates para verlos aquí.
        </p>
      </div>
    );
  }

  // Renderizar los templates para la página actual
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow pb-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {currentTemplates.map((template, index) => {
            // Determinar si es un template del backend
            const isBackendTemplate =
              template.isBackendTemplate ||
              !template.hasOwnProperty("createdAt");

            return (
              <SingleTemplate
                key={
                  template.Id ||
                  template.id ||
                  `template-${index}-${currentPage}`
                }
                template={template}
                isBackend={isBackendTemplate}
                onDelete={!isBackendTemplate ? deleteTemplate : undefined}
                onSelect={selectable ? handleSelect : undefined}
                isSelected={
                  !isBackendTemplate
                    ? selectedTemplate?.id === template.id
                    : selectedBackendTemplate?.id === template.id
                }
                selectable={selectable}
              />
            );
          })}
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {indexOfFirstTemplate + 1}-
              {Math.min(indexOfLastTemplate, allTemplates.length)} de{" "}
              {allTemplates.length} templates
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Anterior
              </button>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesList;
