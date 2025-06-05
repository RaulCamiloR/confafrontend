import axios from "axios";
import { NextResponse } from "next/server";
/*
export async function GET(request: Request) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/campaign/get-campaign`,
      {
        headers: {
          Cookie: request.headers.get("cookie"),
          Authorization: request.headers.get("Authorization"),
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
}*/
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const channelType = url.searchParams.get("channelType");

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/campaign/${channelType}`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
        Authorization: request.headers.get("Authorization") || "",
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error al traer campañas:", error);
    return NextResponse.json(
      { error: "Error al traer campañas" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const { name, type, templateName, segmentName } = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/campaign/create-campaign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") ?? "",
          Authorization: request.headers.get("Authorization") ?? "",
        },
        body: JSON.stringify({
          name,
          type,
          templateName,
          segmentName,
        }),
      },
    );

    if (response.status >= 400) {
      let json_data = { message: "Error no especificado" };
      if (response.headers.get("content-type") === "application/json") {
        json_data = await response.json();
      }
      return NextResponse.json(
        { ok: false, error: `Error al crear campaña: ${json_data?.message}` },
        { status: 500 },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Error de conexión al crear campaña" },
      { status: 500 },
    );
  }
}
