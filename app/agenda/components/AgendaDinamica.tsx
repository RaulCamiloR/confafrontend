"use client"

import React, { useState, useRef } from 'react';
import { FiUpload, FiFile, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';
import Papa from 'papaparse';

const AgendaDinamica = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [jsonData, setJsonData] = useState<Record<string, string>[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Validar que sea un archivo Excel (.xlsx)
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'csv') {
      setNotification({
        message: 'Por favor, seleccione un archivo Excel (.csv)',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setNotification(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

const uploadFiles = async (file: any) => {
  try {
    setIsUploading(true);
    setUploadProgress(0);

  await axios.put("/api/dinamic-agend", file,                  
      {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(percentCompleted);
        }
      }
    );

  setNotification({
        message: `Archivo "${fileName}" subido exitosamente `,
        type: 'success'
      });

  } catch (error) {
    setNotification({
      message: 'Error al subir el archivo.',
      type: 'error',
    });
    console.error(error);
    setIsUploading(false)
    setFile(null);
    setFileName('');

  } finally {
   
    setTimeout(() => {
        handleRemoveFile()
        setIsUploading(false)
        setNotification(null);

      }, 5000);

  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setNotification({
        message: 'Por favor, seleccione un archivo antes de continuar',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setNotification(null);

    try {
            
    Papa.parse(file, {
      delimiter: ';',
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as Record<string, string>[];

          // Convertimos las claves del encabezado a minúscula y las limpiamos
          const originalKeys = Object.keys(data[0] || {});
          const keys = originalKeys.map((key) => key.trim().toLowerCase());

          const formatted = data.map((row) => {
            const cleaned: Record<string, string> = {};
            keys.forEach((key, index) => {
              const originalKey = originalKeys[index];
              cleaned[key] = row[originalKey]?.trim() ?? '';
            });
            return cleaned;
          });
         
          //setJsonData(formatted);        
          uploadFiles(formatted)
        
          

        } catch (err) {
          setNotification({
            message:'Error al procesar el archivo.',
            type:'error'
          });
          console.error(err);
        }
      },
      error: (err) => {
          setNotification({
            message:'Error al leer el archivo CSV.',
            type:'error'
          });
        console.error(err);
      },
    });
                   

      //sendToBackend(formatted);

    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setNotification({
        message: 'Error al subir el archivo. Por favor, inténtelo de nuevo.',
        type: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Agenda Dinámica
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Sube un archivo Excel (.csv) con la información de tu agenda.
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Área para arrastrar y soltar archivos */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors cursor-pointer
              ${isDragging 
                ? 'border-orange-500 bg-orange-50 dark:bg-gray-700' 
                : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx"
              className="hidden"
              id="fileUpload"
            />
            
            <FiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Solo archivos Excel (.csv)
            </p>
          </div>
          
          {/* Mostrar nombre del archivo seleccionado */}
          {fileName && (
            <div className="flex items-center justify-between p-3 mb-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex items-center">
                <FiFile className="text-orange-500 mr-2" size={20} />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                  {fileName}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <FiX size={18} />
              </button>
            </div>
          )}
          
          {/* Barra de progreso */}
          {isUploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-orange-500 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {uploadProgress}% completado
              </p>
            </div>
          )}
          
          {/* Notificación */}
          {notification && (
            <div className={`p-3 mb-4 rounded-md text-sm flex items-center ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              {notification.type === 'success' ? (
                <FiCheck className="mr-2" size={16} />
              ) : (
                <FiX className="mr-2" size={16} />
              )}
              {notification.message}
            </div>
          )}
          
          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isUploading || !file}
            className={`w-full inline-flex justify-center items-center rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !file
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : isUploading
                  ? 'bg-orange-400 text-white cursor-wait'
                  : 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500'
            }`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subiendo...
              </>
            ) : (
              <>
                <FiUpload className="mr-2" />
                Subir Archivo
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgendaDinamica;