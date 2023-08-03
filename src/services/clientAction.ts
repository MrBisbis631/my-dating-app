"use server";

import { getServerSession } from "@/lib/auth/authorization";
import { prisma } from "./prismaClient";
import {Client, Match, User} from '@prisma/client'

type PrismaClient = Client & {
  user: User;
};

export async function banUser({
  userId,
  reason,
}: {
  userId: string;
  reason?: string;
}): Promise<void> {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      bannedReason: reason || undefined,
      isBaned: true,
      client: {
        update: {
          category: "BLACKLISTED",
        },
      },
    },
  });
}

function isAbleToMatch(client1: PrismaClient | null, client2?: PrismaClient | null): boolean {
  // check both clients
  if (!client1 || client1.user?.role !== "CLIENT" || !client2 || client2.user?.role !== "CLIENT") {
    return false;
  }

  // check if clients are banned
  if (client1.user.isBaned || client2.user.isBaned) {
    return false;
  }

  // check if clients are dating
  if (client1.isDating || client2.isDating) {
    return false;
  }

  // check not same gender
  if (client1.gender === client2.gender) {
    return false;
  }

  return true;
}

export async function matchUser({
  id,
  matchId,
}: {
  id: string;
  matchId: string;
}): Promise<null | Match> {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "MATCHMAKER") {
    throw new Error("Unauthorized");
  }

  const client1 = await prisma.client.findUnique({
    where: {
      userId: id,
    },
    include: {
      user: true,
    },
  });
  
  const client2 = await prisma.client.findUnique({
    where: {
      userId: matchId,
    },
    include: {
      user: true,
    },
  });

  // check if clients are able to match
  // else throw error
  if (!isAbleToMatch(client1, client2)) {
    return null;
  }

  // create match
  const match = await prisma.match.create({
    data: {
      client1: {
        connect: {
          userId: id,
        },
      },
      client2: {
        connect: {
          userId: matchId,
        },
      },
      matchmaker: {
        connect: {
          userId: session.user.id,
        },
      },
      status: "PENDING",
    },
  });

  // update clients
  await prisma.client.updateMany({
    where: {
      userId: {
        in: [id, matchId],
      },
    },
    data: {
      isDating: true,
    }
  })

  return match;
}
