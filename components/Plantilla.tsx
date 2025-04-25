"use client"

import React, { useRef, useState } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import { useTemplates } from './context/TemplateContext';
import axios from 'axios';

const Plantilla = () => {
    const emailEditorRef = useRef<EditorRef>(null);
    const { addTemplate } = useTemplates();
    const [templateName, setTemplateName] = useState('');
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const exportHtml = () => {
      if (isProcessing) return;
      
      const unlayer = emailEditorRef.current?.editor;
  
      unlayer?.exportHtml((data) => {
        const { design, html } = data;
        console.log('exportHtml', html);

        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "template.html";
        a.click();
        URL.revokeObjectURL(url);
      });
    };

    const saveTemplate = async() => {
      if (isProcessing) return;
      
      if (!templateName.trim()) {
        alert('Por favor ingrese un nombre para el template');
        return;
      }

      setIsProcessing(true);
      const unlayer = emailEditorRef.current?.editor;
      
      unlayer?.exportHtml(async (data) => {
        const { design, html } = data;
        
        try {
 
          const {data} = await axios.post('/api/create-template', {
            templateName: templateName,
            html: Buffer.from(html).toString('base64')
          })

          console.log({data})
          

          setNotification({ message: '¡Template guardado exitosamente!', type: 'success' });
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 3000);

        } catch (error: any) {
          // Manejar errores
          console.error('Error al guardar el template:', error);
          
          // Verificar si es un error de nombre duplicado
          let errorMsg = 'Error al guardar el template';
          
          if (error.response) {
            const statusCode = error.response.status;
            const responseData = error.response.data;
            
            // Si recibimos un mensaje específico del backend sobre duplicación
            if (statusCode === 409 || (responseData && responseData.error && responseData.error.includes('existe'))) {
              errorMsg = `Ya existe un template con el nombre "${templateName}". Por favor, usa un nombre diferente.`;
            }
          }
          
          setNotification({ message: errorMsg, type: 'error' });
          setTimeout(() => {
            setNotification(null);
            setIsProcessing(false);
          }, 3000);
        }
      });
    };
  
    const onReady: EmailEditorProps['onReady'] = (unlayer) => {
      // editor is ready
      // you can load your template here;
      // the design json can be obtained by calling
      // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
      // const templateJson = { DESIGN JSON GOES HERE };
      // unlayer.loadDesign(templateJson);
    };

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
              onClick={() => setShowSaveForm(true)}
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
                onChange={(e) => setTemplateName(e.target.value)}
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
                onClick={() => setShowSaveForm(false)}
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