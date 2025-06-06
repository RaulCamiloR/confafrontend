import axios from "axios";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dynamic-agenda`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") ?? "",
          Authorization: request.headers.get("Authorization") ?? "",
        },
        body:  JSON.stringify(body),
      },
    );
    if (response.status >= 400) {
      let json_data = { message: "Error no especificado" };
      if (response.headers.get("content-type") === "application/json") {
        json_data = await response.json();
      }
      return NextResponse.json(
        { ok: false, error: `Error al crear Agenda Dinámica: ${json_data?.message}` },
        { status: 500 },
      );
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Error de conexión al crear Agenda Dinámica" },
      { status: 500 },
    );
  }
}