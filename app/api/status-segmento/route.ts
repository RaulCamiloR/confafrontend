import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    let path = url.searchParams.get("path") ?? "";
    path = path.substring(1);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
          Authorization: request.headers.get("Authorization") || "",
        },
      },
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error al traer templates:", error);
    return NextResponse.json(
      { error: "Error al traer templates" },
      { status: 500 },
    );
  }
}
