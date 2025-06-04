import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const channelType = url.searchParams.get("channelType");

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/segment/${channelType}`,
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
          Authorization: request.headers.get("Authorization") || "",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error al traer templates:", error);
    return NextResponse.json(
      { error: "Error al traer templates" },
      { status: 500 }
    );
  }
}

/*
export async function GET(request: Request) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/segment/segments?${request.url.split("?")[1]}`,
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
}
*/