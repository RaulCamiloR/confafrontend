export async function refresh_token(cookie: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
      {
        headers: { Cookie: cookie },
      },
    );

    if (response.status >= 400) {
      let json_data = { message: "Error no especificado" };
      if (response.headers.get("content-type") === "application/json") {
        json_data = await response.json();
      }
      const error = json_data?.message;
      console.debug("");
      console.debug("Cookies enviadas:", cookie);
      console.error("Error al refrescar tokens de sesión:", error);
      console.debug("");
      return "";
    }

    return response.headers.get("set-cookie") ?? "";
  } catch (error) {
    console.error("Error al refrescar tokens de sesión:", error);
    return "";
  }
}
