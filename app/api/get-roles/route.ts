import { NextResponse } from "next/server";

export async function GET(request: Request){

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/role/get-roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();

        return NextResponse.json(data);

    } catch (error) {
        console.error("Error al obtener los roles:", error);
        return NextResponse.json({ error: "Error al obtener los roles" }, { status: 500 });
    }
}
