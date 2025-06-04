import { NextResponse } from "next/server";

export async function DELETE (request: Request) {
    const { email } = await request.json();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/delete-user`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Cookie: request.headers.get("cookie") ?? "",
                Authorization: request.headers.get("Authorization") ?? "",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar el usuario" }, { status: 500 });
    }
}