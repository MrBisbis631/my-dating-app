// extends session and jwt types to contain id and role
import { Role } from "@prisma/client";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      role: Role;
      id: string;
      email: string;
      name: string;
      image: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      role: Role;
      id: string;
    };
  }
}
