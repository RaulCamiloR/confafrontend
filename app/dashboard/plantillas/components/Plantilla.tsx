"use client"

import React from 'react';
import EmailEditor from 'react-email-editor';
import { useTemplateEditor } from '@/app/dashboard/plantillas/hooks/useTemplateEditor';

<<<<<<< Updated upstream
const Plantilla = () => {
    const {
      emailEditorRef,
      templateName,
      showSaveForm,
      notification,
      isProcessing,
      exportHtml,
      saveTemplate,
      onReady,
      handleTemplateNameChange,
      toggleSaveForm,
      cancelSaveForm
    } = useTemplateEditor();
=======
const Plantilla = ({ templateToEdit }: { templateToEdit?: Template }) => {
  const {
    emailEditorRef,
    templateName,
    showSaveForm,
    notification,
    isProcessing,
    exportHtml,
    saveTemplate,
    onReady,
    handleTemplateNameChange,
    toggleSaveForm,
    cancelSaveForm,
    duplicateTemplate
  } = useTemplateEditor({
    defaultContent: templateToEdit?.design,
    name: templateToEdit?.name,
  });
  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 bg-gray-800 relative">
        <div className="flex space-x-2">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={exportHtml}
            disabled={isProcessing}
          >
            Exportar HTML
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={toggleSaveForm}
            disabled={isProcessing}
          >
            Guardar Template
          </button>
          {/* {templateToEdit?.id && 
           <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={duplicateTemplate}
            disabled={isProcessing}
          >
            Duplicar Template
          </button>
          } */} // TODO DESCOMENTAR
        </div>
>>>>>>> Stashed changes

    return (
      <div className="flex flex-col h-screen">
        <div className="flex justify-between items-center p-4 bg-gray-800 relative">
          <div className="flex space-x-2">
            <button 
              className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed' 
              onClick={exportHtml}
              disabled={isProcessing}
            >
              Exportar HTML
            </button>
            <button 
              className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed' 
              onClick={toggleSaveForm}
              disabled={isProcessing}
            >
              Guardar Template
            </button>
          </div>
          
          {/* Formulario de guardar template */}
          {showSaveForm && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={templateName}
                onChange={handleTemplateNameChange}
                placeholder="Nombre del template"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-700 text-gray-200 placeholder-gray-400"
              />
              <button 
                onClick={saveTemplate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isProcessing}
              >
                {isProcessing ? 'Guardando...' : 'Guardar'}
              </button>
              <button 
                onClick={cancelSaveForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isProcessing}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Mensaje de notificación */}
        {notification && (
          <div className={`absolute top-16 right-4 px-4 py-2 rounded-md shadow-md text-sm flex items-center z-10 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {notification.message}
          </div>
        )}

        <div className='flex-1 w-full'>
            <EmailEditor 
              ref={emailEditorRef} 
              onReady={onReady} 
              options={{
                appearance: {
                    theme: 'modern_dark',
                    panels: {
                        tools: {
                            dock: 'left',
                        }
                    }
                },
                displayMode: 'email',
              }} 
            />
        </div>
      </div>
    );
}

export default Plantilla;