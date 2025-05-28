"use client"
// hi
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useUserStore from '@/stores/userStore';

const LoginComponent = () => {
  const router = useRouter();
  const [username, setUsername] = useState("gastonisnardi");
  const [password, setPassword] = useState("Be482e1fd2@");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const setUser = useUserStore((state) => state.setUser);

  // Efecto para manejar la animación de carga después del login exitoso
  useEffect(() => {
    // Si estamos redirigiendo, mantenemos el estado de carga activo
    if (isRedirecting) {
      setLoading(true);
    }
  }, [isRedirecting]);

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setUsernameError(true);
      return;
    }
    
    if (!password.trim()) {
      setPasswordError(true);
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post('/api/login', {
        userName: username,
        password: password
      });

      setUser(response.data.user);
      
      setIsRedirecting(true);
      
      router.push('/');
      
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      setError(error.response?.data?.error || 'Error al iniciar sesión');
      setLoading(false);
      setIsRedirecting(false);
    }
  };

  // Determinar si los controles deben estar deshabilitados
  const isDisabled = loading || isRedirecting;

  return (
    <div className="flex flex-col items-center justify-center bg-[#f8f8f8] min-h-screen">
      <div className="mb-4">
        <Image
          src="/images/confa-logo.png"
          alt="Logo Confa"
          width={180}
          height={70}
          priority
        />
      </div>
      
      <div
        className="flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-6 rounded-lg shadow-md text-center w-[350px]"
        style={{ backgroundImage: `url(/images/backgroundLogin.png)` }}
      >
        <h2 className="text-white text-2xl font-medium mb-8">
          Iniciar Sesión
        </h2>
        
        <form onSubmit={handleLogin} className="w-full">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError(false);
            }}
            disabled={isDisabled}
            className={`w-full p-3 mb-4 rounded-lg ${
              usernameError 
                ? 'border-2 border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' 
                : 'border border-gray-300'
            } outline-none bg-white text-gray-700 placeholder:text-gray-500 transition-all duration-200 focus:border-[#0091E0] focus:border-2 focus:ring-4 focus:ring-[#0091E0]/30 focus:shadow-[0_0_0_1px_#0091E0] disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
            disabled={isDisabled}
            className={`w-full p-3 mb-6 rounded-lg ${
              passwordError 
                ? 'border-2 border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' 
                : 'border border-gray-300'
            } outline-none bg-white text-gray-700 placeholder:text-gray-500 transition-all duration-200 focus:border-[#0091E0] focus:border-2 focus:ring-4 focus:ring-[#0091E0]/30 focus:shadow-[0_0_0_1px_#0091E0] disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isDisabled}
              className="px-8 py-2 bg-white text-[#0091E0] font-medium rounded-lg border-2 border-[#0091E0] hover:bg-[#0091E0] hover:text-white hover:border-[#0091E0] hover:shadow-[0_0_0_2px_rgba(0,145,224,0.2)] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDisabled ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0091E0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isRedirecting ? 'Redirigiendo...' : 'Ingresando...'}
                </span>
              ) : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-3">
          {error}
        </p>
      )}

      {isDisabled && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex flex-col justify-center items-center z-[1000]">
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-xl">
            <svg className="animate-spin h-10 w-10 text-[#0091E0] mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-700 text-lg font-medium">
              {isRedirecting ? 'Redirigiendo...' : 'Autenticando...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
