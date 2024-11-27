/*import { NextResponse } from "next/server";

export default function middlewar(request) {
  // Produce a response that redirects user to a URL
  return NextResponse.redirect(new URL("/about", request.url));
}*/

import { auth } from "@/app/_lib/auth";
export const middleware = auth;

export const config = {
  matcher: ["/account"],
};
