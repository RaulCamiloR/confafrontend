import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  
  /*
  const accessToken = request.cookies.get('AccessToken');
  
  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/auth'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  
  if (!accessToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  if (accessToken && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  */
  
  return NextResponse.next();
}


export const config = {
  matcher: [
    /*
    // Rutas que requieren autenticación
    '/',
    '/dashboard/:path*',
    // Rutas públicas (para redirigir si ya está autenticado)
    '/auth',
    '/otros',
    */
    // Excluir archivos estáticos y API
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 