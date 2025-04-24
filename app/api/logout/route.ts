import { NextResponse } from "next/server";

export async function POST(request: Request) {


    try {

        const res = NextResponse.json({ ok: true, message: 'Logout successful' }, { status: 200 });

        res.cookies.delete('AccessToken');
        res.cookies.delete('RefreshToken');
        res.cookies.delete('IdToken');
        res.cookies.delete('TokenType');

        return res;
      
        
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
    }

}