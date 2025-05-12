"use client"

import React, { useState } from 'react';
import axios from 'axios';

interface NotificationType {
  message: string;
  type: 'success' | 'error';
}

const SMSTemplate = () => {
  const [templateName, setTemplateName] = useState('');
  const [smsContent, setSmsContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [charactersLeft, setCharactersLeft] = useState(160);

  // Manejar cambios en el contenido SMS
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setSmsContent(content);
    setCharactersLeft(160 - content.length);
  };

  // Guardar la plantilla SMS
  const saveTemplate = async () => {
    if (isProcessing) return;
    
    if (!templateName.trim()) {
      setNotification({
        message: 'Por favor, ingresa un nombre para la plantilla',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (!smsContent.trim()) {
      setNotification({
        message: 'Por favor, ingresa el contenido del SMS',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsProcessing(true);

    try {
      const params = {
        templateName,
        content: smsContent,
        channel: 'sms'
      };

      const { data } = await axios.post('/api/create-template', params);
      
      setNotification({
        message: '¡Plantilla SMS guardada exitosamente!',
        type: 'success'
      });
      
      // Limpiar campos después de guardar
      setTemplateName('');
      setSmsContent('');
      setCharactersLeft(160);
      
      setTimeout(() => {
        setNotification(null);
        setIsProcessing(false);
      }, 3000);
      
    } catch (error: any) {
      console.error('Error al guardar la plantilla SMS:', error);
      
      let errorMsg = 'Error al guardar la plantilla SMS';
      
      if (error.response) {
        const statusCode = error.response.status;
        const responseData = error.response.data;
        
        if (statusCode === 409 || (responseData && responseData.error && responseData.error.includes('existe'))) {
          errorMsg = `Ya existe una plantilla con el nombre "${templateName}". Por favor, usa un nombre diferente.`;
        }
      }
      
      setNotification({
        message: errorMsg,
        type: 'error'
      });
      
      setTimeout(() => {
        setNotification(null);
        setIsProcessing(false);
      }, 3000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {notification && (
        <div className={`mb-4 p-3 rounded-md ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre de la plantilla
        </label>
        <input
          id="templateName"
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Ej: Confirmación de cita"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          disabled={isProcessing}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="smsContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Contenido del SMS
        </label>
        <textarea
          id="smsContent"
          value={smsContent}
          onChange={handleContentChange}
          placeholder="Escribe el contenido de tu SMS aquí..."
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          maxLength={160}
          disabled={isProcessing}
        />
        <div className={`text-sm mt-1 flex justify-end ${
          charactersLeft < 0 ? 'text-red-500' : charactersLeft < 20 ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {charactersLeft} caracteres restantes
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={saveTemplate}
          disabled={isProcessing}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : 'Guardar Plantilla SMS'}
        </button>
      </div>
    </div>
  );
};

export default SMSTemplate; 