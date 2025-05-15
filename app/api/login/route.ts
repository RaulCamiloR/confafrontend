import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userName, password } = await request.json();

  if (!userName || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({ email: userName, password }),
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        credentials: "include",
      },
    );

    if (response.status >= 400) {
      let json_data = { message: "Error no especificado" };
      if (response.headers.get("content-type") === "application/json") {
        json_data = await response.json();
      }
      return NextResponse.json(
        { ok: false, error: `Error al iniciar sesion: ${json_data?.message}` },
        { status: 500 },
      );
    }

    const { user } = await response.json();

    const res = NextResponse.json(
      { ok: true, message: "Login successful", user },
      { status: 200 },
    );

    const setCookie = response.headers.get("set-cookie");

    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 },
    );
  }
}
