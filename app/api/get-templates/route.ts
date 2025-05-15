import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/templates`,
      {
        headers: {
          Cookie: request.headers.get("cookie"),
          Authorization: request.headers.get("Authorization"),
        },
      },
    );

    // console.log("Templates recibidos del backend:", response.data);

    let templates: any[] = [];

    if (response.data?.templates) {
      templates = response.data.templates;
      console.log(`Se encontraron ${templates.length} templates`);
    } else if (Array.isArray(response.data)) {
      templates = response.data;
      console.log(
        `Se encontraron ${templates.length} templates (formato array)`,
      );
    } else {
      console.log("Formato de respuesta inesperado:", response.data);
      templates = [];
    }

    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error("Error al traer templates:", error);
    return NextResponse.json(
      { error: "Error al traer templates" },
      { status: 500 },
    );
  }
}
