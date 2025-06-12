import { NextResponse } from "next/server";

export async function POST(request: Request) {
  
  const { email, name, lastName, rol, password } = await request.json();

  console.log({ email, name, lastName, rol, password });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/create-user`,
      {
        method: "POST",
        body: JSON.stringify({ 
            email, 
            name, 
            lastName, 
            roleName: rol, 
            password,
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
      { error: "Error al crear usuario" },
      { status: 500 },
    );
  }
}
