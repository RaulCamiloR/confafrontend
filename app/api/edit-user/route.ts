import { NextResponse } from "next/server";

export async function POST(request: Request) {
  
  const { id, rol, area, email } = await request.json();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/update-user`,
      {
        method: "POST",
        body: JSON.stringify({ 
            id,
            email,
            roleName: rol, 
            areaName: area,
        }),
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") ?? "",
          Authorization: request.headers.get("Authorization") ?? "",
        },
        cache: "no-store",
        credentials: "include",
      },
    );

    const data = await response.json();

    console.log({ data });

    const res = NextResponse.json(
      { ok: true, data },
      { status: 200 },
    );

    return res;

  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { error: "Error al editar usuario" },
      { status: 500 },
    );
  }
}
