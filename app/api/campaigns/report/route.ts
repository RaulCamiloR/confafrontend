import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const channelType = url.searchParams.get("channelType");
    const campaignId = url.searchParams.get("campaignId");
    const format = url.searchParams.get("format");

    console.log(
      `${process.env.NEXT_PUBLIC_BASE_URL}/campaign/report/${channelType}/${campaignId}/${format}`,
    );

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/campaign/report/${channelType}/${campaignId}/${format}`,
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
          Authorization: request.headers.get("Authorization") || "",
        },
        // Never throw
        // validateStatus: () => true,
      },
    );

    const buffer = Buffer.from(response.data, "base64");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers["content-type"],
        "Content-Disposition": response.headers["content-disposition"],
      },
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error al traer campañas:", error);
    return NextResponse.json(
      { error: "Error al traer campañas" },
      { status: 500 },
    );
  }
}
