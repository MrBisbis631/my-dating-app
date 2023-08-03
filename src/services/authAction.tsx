"use server";

import { getServerSession } from "@/lib/auth/authorization";
import { prisma } from "./prismaClient";
import { comparePassword, hashPassword } from "@/lib/auth/password-utils";

type ChangePasswordArgs = {
  oldPassword: string;
  newPassword: string;
};

export async function changePassword({ oldPassword, newPassword }: ChangePasswordArgs): Promise<string> {
  const session = await getServerSession()
  if (!session || !session.user) {
    return "user not found"
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (
      !user ||
      !(await comparePassword(oldPassword, user.password_hash))
    ) {
      return "password doesn't match"
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password_hash: await hashPassword(newPassword),
      },
    });
    return ""
  } catch (error) {
    return "Something went wrong"
  }
}
