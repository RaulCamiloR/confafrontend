import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/get-user`,
      {
        method: "GET",        
        headers: {
            "Content-Type": "application/json",
            Cookie: request.headers.get("cookie") ?? "",
            Authorization: request.headers.get("Authorization") ?? "",
          },
      },
    );

    const data = await response.json();

    return NextResponse.json({ ok: true, users: data.users }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 },
    );
  }
}

