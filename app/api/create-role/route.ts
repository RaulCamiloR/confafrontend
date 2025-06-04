import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { name, description, module } = await request.json();

        console.log({ name, description, module })

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/role/create-role`, {
            method: "POST",
            body: JSON.stringify({ name, description, module }),
            headers: {
                "Content-Type": "application/json",
                Cookie: request.headers.get("cookie") ?? "",
                Authorization: request.headers.get("Authorization") ?? "",
            },
            cache: "no-store",
            credentials: "include",
        });

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        return NextResponse.json({ error: "Error al crear el rol" }, { status: 500 });
    }
}