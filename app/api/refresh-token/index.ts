export async function refresh_token(cookie: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
      {
        headers: { Cookie: cookie },
      },
    );

    return response.headers.get("set-cookie") ?? "";
  } catch (error) {
    console.error("Error al refrescar tokens de sesión:", error);
    return "";
  }
}
