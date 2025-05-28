"use client";

import React, { useState } from "react";
import Plantilla from "@/app/dashboard/plantillas/components/Plantilla";
import TemplatesList from "@/app/dashboard/plantillas/components/TemplatesList";
import { TemplateType, templateConstants } from "../constants/plantillas";
import SMSTemplate from "../components/SMSTemplate";
import { Template } from "../contexts/TemplateContext";

const PlantillasPage = ({
  hasEmailPermission,
  hasSmsPermission,
  hasEmailPermissionWriteOnly,
  hasSmsPermissionWriteOnly,
}: {
  hasEmailPermission: boolean;
  hasSmsPermission: boolean;
  hasEmailPermissionWriteOnly: boolean;
  hasSmsPermissionWriteOnly: boolean;
}) => {
  const [templateType, setTemplateType] = useState<TemplateType>(
    hasEmailPermission ? "EMAIL" : hasSmsPermission ? "SMS" : "EMAIL",
  );
  const [showEditor, setShowEditor] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [editorType, setEditorType] = useState<TemplateType>(
    hasEmailPermission ? "EMAIL" : hasSmsPermission ? "SMS" : "EMAIL",
  );
  const [templateToEdit, setTemplateToEdit] = useState<Template | undefined>();

  const handleBackToList = () => {
    setShowEditor(false);
    setShowTemplateSelection(false);
  };

  return (
    <div className="p-6 h-full overflow-y-scroll">
      {/* Estado 1: Lista de plantillas */}
      {!showEditor && !showTemplateSelection && (
        <>
          <div className="flex justify-between items-center mb-6">
            <button
              disabled={
                !(hasEmailPermissionWriteOnly || hasSmsPermissionWriteOnly)
              }
              onClick={() => setShowTemplateSelection(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-orange-500"
            >
              Crear Nueva Plantilla
            </button>

            {/* Selector de tipo de plantilla */}
            <div className="flex space-x-2">
              {templateConstants.templateTypes
                .filter((type) =>
                  type === "EMAIL"
                    ? hasEmailPermission
                    : type === "SMS"
                      ? hasSmsPermission
                      : false,
                )
                .map((type) => (
                  <button
                    key={type}
                    onClick={() => setTemplateType(type as TemplateType)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      templateType === type
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {type}
                  </button>
                ))}
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Plantillas de {templateType} Guardadas
          </h2>
          <TemplatesList
            type={templateType}
            onSelect={(template) => {
              setShowEditor(true);
              setTemplateToEdit(template);
            }}
            selectable
            grid
          />
        </>
      )}

      {/* Estado 2: Selección de tipo de plantilla a crear */}
      {showTemplateSelection && (
        <div className="h-full">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Volver a la lista
            </button>
          </div>

          <div className="flex items-center justify-center mt-8">
            {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">*/}
            <div className="flex justify-evenly gap-6 max-w-4xl">
              {hasEmailPermissionWriteOnly && (
                <div
                  onClick={() => {
                    setEditorType("EMAIL");
                    setShowTemplateSelection(false);
                    setShowEditor(true);
                  }}
                  className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 min-w-96"
                >
                  <div className="flex justify-center mb-4 text-orange-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center text-gray-800 dark:text-white">
                    Template de Email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Crea una plantilla de email con editor visual
                  </p>
                </div>
              )}

              {hasSmsPermissionWriteOnly && (
                <div
                  onClick={() => {
                    setEditorType("SMS");
                    setShowTemplateSelection(false);
                    setShowEditor(true);
                  }}
                  className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 min-w-96"
                >
                  <div className="flex justify-center mb-4 text-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center text-gray-800 dark:text-white">
                    Template de SMS
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Crea una plantilla de texto para SMS
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Estado 3: Editor correspondiente */}
      {showEditor && (
        <div className="h-[calc(100vh-160px)]">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Volver a la lista
            </button>
            <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">
              Creando Template de {editorType}
            </span>
          </div>

          {editorType === "EMAIL" ? (
            <Plantilla templateToEdit={templateToEdit} />
          ) : (
            <SMSTemplate />
          )}
        </div>
      )}
    </div>
  );
};

export default PlantillasPage;
