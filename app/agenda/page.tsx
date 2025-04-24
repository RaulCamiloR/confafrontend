'use client'

import React from 'react';
import AgendaDinamica from '@/components/agenda/AgendaDinamica';
import { FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const Agenda = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8 px-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Agenda Dinámica
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Administra tus agendas de contactos para campañas
            </p>
          </div>
          
          <button
            onClick={handleGoBack}
            className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <FiArrowLeft className="mr-2" />
            Atrás
          </button>
        </div>
        
        <AgendaDinamica />
      </div>
    </div>
  );
};

export default Agenda;