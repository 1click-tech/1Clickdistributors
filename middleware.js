import { NextResponse } from "next/server";

export function middleware(request) {
  // Check if the user is on the root page
  //   if (request.nextUrl.pathname === "/") {
  //     // Define the redirect URL
  //     const redirectUrl = new URL("/board", request.url);
  //     return NextResponse.redirect(redirectUrl);
  //   }

  // Proceed with the request if it's not the root page
  return NextResponse.next();
}

// Specify the path where the middleware should apply
export const config = {
  matcher: "/",
};
