

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import  jwt, { JwtPayload }  from 'jsonwebtoken';
import { jwtUtils } from './utiliti/jwt';
import { getNewAccessToken } from './service/getNewAccessToken';
import { cookies } from 'next/headers';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const cookieStore = await cookies()

    const auth_route = ['/login', '/register']
    const pathName = request.nextUrl.pathname

    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value

    let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null

    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken as string, process.env.JWT_REFRESH_SECRET as string) : null

    console.log(decodedAccessToken)


    if(!decodedAccessToken?.success && decodedRefreshToken?.success){
        console.log("refrsh")
          const result = await getNewAccessToken(refreshToken as string);

          console.log(result , 'crate new access token')

        if(result.success){
            const newAccessToken = result.data.accessToken;

            cookieStore.set("accessToken", newAccessToken , {
                httpOnly : true,
                maxAge : 60 * 60 * 24,
                sameSite : "lax",
            });

            accessToken = newAccessToken;
            decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string);


        }
    }

     if(!decodedAccessToken?.success){
        //token has expired or is invalid, clear the cookies
        cookieStore.delete("accessToken");
        // return NextResponse.redirect(new URL('/login', request.url));
    }

    let userRole = null;

    if(decodedAccessToken?.success && decodedAccessToken.data){
        userRole = (decodedAccessToken?.data as JwtPayload).role;
    }

    if(accessToken && auth_route.includes(pathName)){
        if(userRole === "USER"){
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return NextResponse.next()
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}