"use server";

import { getServerSession } from "@/lib/auth/authorization";
import { prisma } from "./prismaClient";

export async function acceptMatchmaker(id: string): Promise<string | null> {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return "unauthorized"
  }

  await prisma.matchmaker.update({
    where: {
      userId: id,
    },
    data: {
      adminAuthorizerId: session.user.id,
    },
  });

  return null
}