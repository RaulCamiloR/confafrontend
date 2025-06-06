import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { segmentName, channelType, fileName, fileType } =
      await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/segment/${channelType}`,
      {
        method: "POST",
        headers: {
          Cookie: request.headers.get("cookie") ?? "",
          Authorization: request.headers.get("Authorization") ?? "",
        },
        body: JSON.stringify({
          fileName,
          contentType: fileType,
          segmentName
        }),
      },
    );

    const data = await response.json();

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 },
    );
  }
}
