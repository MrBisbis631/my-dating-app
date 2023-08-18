import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { adminRoutes, clientRoutes, mmRoutes } from "@/lib/users-paths";
import { env } from "@/env.mjs";

const adminRoutesList = Object.values(adminRoutes);
const mmRoutesList = Object.values(mmRoutes);
const clientRoutesList = Object.values(clientRoutes);

const protectedRoutes = [
  ...adminRoutesList,
  ...mmRoutesList,
  ...clientRoutesList,
];

function redirectToSignIn() {
  return NextResponse.redirect(new URL("/sign-in", env.APP_BASE_URL));
}

function isNotProtectedPaths(pathname: string) {
  return !protectedRoutes.some((p) => pathname.startsWith(p));
}

function isInMMPaths(pathname: string) {
  return mmRoutesList.some((p) => pathname.startsWith(p));
}

function isInClientPaths(pathname: string) {
  return clientRoutesList.some((p) => pathname.startsWith(p));
}

// middleware to protect routes
export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (
      role === "ADMIN" ||
      (role === "MATCHMAKER" && isInMMPaths(pathname)) ||
      (role === "CLIENT" && isInClientPaths(pathname)) ||
      isNotProtectedPaths(pathname)
    )
      return;

    return redirectToSignIn();
  },
  {
    callbacks: {
      authorized: () => true,
    },
    pages: {
      signIn: "/sign-in",
    },
  }
);
