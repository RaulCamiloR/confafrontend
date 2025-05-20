// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
//
// export function middleware(request: NextRequest) {
//
//   /*
//   const accessToken = request.cookies.get('AccessToken');
//
//   // Rutas públicas que no requieren autenticación
//   const publicPaths = ['/auth'];
//   const isPublicPath = publicPaths.some(path =>
//     request.nextUrl.pathname.startsWith(path)
//   );
//
//
//   if (!accessToken && !isPublicPath) {
//     return NextResponse.redirect(new URL('/auth', request.url));
//   }
//
//   if (accessToken && isPublicPath) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }
//   */
//
//   return NextResponse.next();
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refresh_token } from "./app/api/refresh-token";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/api/login") ||
    request.nextUrl.pathname.startsWith("/api/logout")
  ) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.has("RefreshToken");
  if (!refreshToken) {
    if (
      !(
        request.nextUrl.pathname.startsWith("/auth") ||
        request.nextUrl.pathname.startsWith("/api")
      )
    ) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    return NextResponse.next();
  }

  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers);

  const cookiesObj: { IdToken: string; [key: string]: string } = {
    IdToken: "",
  };
  let cookie = requestHeaders.get("cookie") ?? "";
  let setCookie = false;

  let idToken = "";
  if (!request.cookies.has("IdToken")) {
    cookie = await refresh_token(request.headers.get("cookie") ?? "");

    if (cookie !== "") {
      // Parse cookies manually
      if (cookie) {
        cookie.split(";").forEach((c) => {
          const [name, value] = c.trim().split("=");
          cookiesObj[name] = value;
        });
      }

      setCookie = true;
      idToken = cookiesObj?.IdToken;
    }
  } else {
    idToken = request.cookies.get("IdToken")?.value ?? "";
  }

  if (idToken && request.nextUrl.pathname.startsWith("/api")) {
    requestHeaders.set("Authorization", `Bearer ${idToken}`);
  }

  requestHeaders.set("cookie", cookie);

  // You can also set request headers in NextResponse.next
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  if (setCookie) {
    response.headers.set("set-cookie", cookie);
  }

  return response;
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
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
