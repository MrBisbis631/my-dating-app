import { prisma } from "@/services/prismaClient";
import { User, Role, Matchmaker } from "@prisma/client";
import { comparePassword } from "@/lib/auth/password-utils";
import {
  getServerSession as nextAuthGetServerSession,
  type Session,
} from "next-auth";
import { authOptions } from "@/config/nextAuth";

type UserWithMatchmaker = User & { matchmaker?: Matchmaker };

export type Credentials = Pick<User, "email"> & { password: string } & Pick<
    User,
    "role"
  >;

// check if user is authorized
export function isAuthorized(user: User, mustBe: Role = "CLIENT"): boolean {
  return user.role === mustBe && !user.isBaned;
}

// get user from db and check if user is authorized
export async function getAuthorizedUser(
  credentials: Credentials,
): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email || "" },
    include: {
      admin: true,
      client: true,
      matchmaker: true,
    },
  });

  // if user is matchmaker and not authorized by admin, reject
  if (user?.role === "MATCHMAKER" && !user?.matchmaker?.adminAuthorizerId) {
    return null;
  }

  // if user not found or wrong role or user is baned or wrong password
  if (
    !user || // user not found
    user.role !== credentials.role || // wrong role
    user.isBaned || // user is baned
    !(await comparePassword(credentials.password, user.password_hash || "")) // wrong password
  )
    return null;

  return user;
}

// check if user is authorized by role policy
export function isAuthorizedByRolePolicy(role: Role, match: Role): boolean {
  switch (match) {
    case "ADMIN":
      return role === "ADMIN";
    case "MATCHMAKER":
      return role === "MATCHMAKER" || role === "ADMIN";
    case "CLIENT":
      return role === "CLIENT" || role === "ADMIN" || role === "MATCHMAKER";
    default:
      return false;
  }
}

// get user session if exist
export async function getServerSession(): Promise<Session | null> {
  return await nextAuthGetServerSession(authOptions);
}
