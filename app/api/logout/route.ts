import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/log-out`,
      {
        headers: { Cookie: request.headers.get("cookie") ?? "" },
      },
    );

    const res = NextResponse.json(
      { ok: true, message: "Logout successful" },
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

