import { useRouter } from 'next/navigation';
import useUserStore from '@/stores/userStore';
import { useState } from 'react';

/**
 * Hook personalizado para manejar el cierre de sesión
 * @returns Objeto con función para ejecutar el logout y estado de carga
 */
const useLogout = () => {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    if (isLoading) return; // Prevenir múltiples clicks
    
    setIsLoading(true);
    
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });

      localStorage.removeItem('user-storage');
      
      clearUser();
      
      router.push('/auth');
      
      // No cambiamos isLoading a false porque estamos redirigiendo
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
};

export default useLogout; 