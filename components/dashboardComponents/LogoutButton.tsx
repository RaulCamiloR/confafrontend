"use client"

import { MdLogout } from 'react-icons/md'
import useLogout from '@/hooks/useLogout';

const LogoutButton = () => {
    const { logout, isLoading } = useLogout();
    
    return (
        <button 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-orange-500 hover:bg-[#3a4659] hover:text-red-300 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={logout}
          disabled={isLoading}
        >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Cerrando sesión...</span>
              </>
            ) : (
              <>
                <MdLogout className="text-xl flex-shrink-0" />
                <span>Cerrar Sesión</span>
              </>
            )}
        </button>
  );
};

export default LogoutButton;