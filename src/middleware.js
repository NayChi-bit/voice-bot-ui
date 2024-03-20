import { NextResponse } from "next/server";
import Cookies from "js-cookie";
 export async function middleware(request) {
    var keepLogin = false;
    const currentUser = request.cookies.get('currentUser')?.value;
    const expireTime = Date.parse(request.cookies.get('expireTime')?.value);

    console.log("current user " + JSON.stringify(currentUser));
    console.log("expireTime " + expireTime);

    const { pathname } = new URL(request.url, 'http://localhost');
   
    if ((!currentUser || Date.now() > expireTime) &&  pathname !== '/') {
      console.log("expire or no user");
      request.cookies.delete("currentUser");
      request.cookies.delete("expireTime");
      const response = NextResponse.redirect(new URL("/", request.url));
      return response;
    }
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}