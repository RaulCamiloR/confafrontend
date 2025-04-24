import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const { userName, password } = await request.json();

    if(!userName || !password){
        return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ userName, password }),
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-store',
            credentials: 'include'
        });

        console.log(response)

        const {user, cookies: cookiesArray} = await response.json();
        

        const res = NextResponse.json({ ok: true, message: 'Login successful', user }, { status: 200 });
/*
        cookiesArray.forEach((cookieStr: string) => {

            const [pair, ...attrList] = cookieStr.split(';').map((s) => s.trim())
            const [name, value] = pair.split('=')
      
            const options: {
              path?: string
              httpOnly?: boolean
              secure?: boolean
              sameSite?: 'lax' | 'strict' | 'none'
              maxAge?: number
              domain?: string
            } = { path: '/' }
      
            attrList.forEach((attr) => {
              const [k, v] = attr.split('=').map((s) => s.trim())
              switch (k.toLowerCase()) {
                case 'httponly':
                  options.httpOnly = true
                  break
                case 'secure':
                  options.secure = true
                  break
                case 'samesite':
                  options.sameSite = v.toLowerCase() as 'lax' | 'strict' | 'none'
                  break
                case 'max-age':
                  options.maxAge = parseInt(v, 10)
                  break
                case 'domain':
                  options.domain = v
                  break
                case 'path':
                  options.path = v
                  break
              }
            })
      
            res.cookies.set(name, value, options)
          })
*/

        const setCookie = response.headers.get('set-cookie')

        if(setCookie){
          res.headers.set('set-cookie', setCookie)
        }

        return res;
      
        
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
    }

}